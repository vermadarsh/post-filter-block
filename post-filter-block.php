<?php
/**
 * Plugin Name: Post Filter Block
 * Author: Adarsh Verma
 * Author URI: https://github.com/vermadarsh/
 * Version: 1.0.0
 * Description: This plugin relates to my first custom gutenberg block.
 * Text Domain: post-filter-block
 */

/**
 * Enqueue custom assets.
 */
function pfb_post_filter_admin_js_css() {

	wp_enqueue_style( 'theme-prefix-post-filter-block-css',  plugin_dir_url( __FILE__ ). '/css/theme-prefix-post-filter-block.css' , array(), wp_get_theme()->get( 'Version' ) );
	wp_enqueue_script( 'theme-prefix-post-filter-block-js', plugin_dir_url( __FILE__ ) . '/js/block.build.js', array(
		'wp-blocks',
		'wp-i18n',
		'wp-element'
	), '1.1', true );

}

add_action( 'enqueue_block_editor_assets', 'pfb_post_filter_admin_js_css' );

/**
 * Enqueued custom assets to be loaded in frontend.
 */
function pfb_post_filter_front_css() {
	wp_enqueue_style( 'theme-prefix-post-filter-block-css', plugin_dir_url( __FILE__ ) . '/css/theme-prefix-post-filter-block.css', array(), wp_get_theme()->get( 'Version' ) );
}

add_action( 'wp_enqueue_scripts', 'pfb_post_filter_front_css' );

/**
 * Register block type.
 * Block: Posts Filter
 */
function pfb_init() {
	register_block_type( 'postfilter/posts-filter', array(
		'render_callback' => 'pfb_post_filter_callback',
		'attributes'      => [
			'post_type'      => [
				'default' => '',
				'type'    => 'string'
			],
			'post_taxs'      => [
				'default' => '',
				'type'    => 'string'
			],
			'post_category'  => [
				'default' => '',
				'type'    => 'string'
			],
			'number_of_post' => [
				'default' => '1',
				'type'    => 'number'
			],
			'layout'         => [
				'default' => '',
				'type'    => 'string'
			],
			'exclude_post'   => [
				'default' => '',
				'type'    => 'string'
			]
		]
	) );
}

add_action( 'init', 'pfb_init' );

/**
 * This callback returns the actual HTML that will be rendered for public view.
 *
 * @param $attributes
 *
 * @return false|string
 */
function pfb_post_filter_callback( $attributes ) {
	$post_type      = $attributes['post_type'];
	$post_taxs      = $attributes['post_taxs'];
	$post_category  = $attributes['post_category'];
	$number_of_post = $attributes['number_of_post'];
	$exclude_post   = $attributes['exclude_post'];
	$layout         = $attributes['layout'];

	$args = array(
		'post_status'    => array( 'publish' ),
		'posts_per_page' => $number_of_post,
	);
	if ( $post_type !== '' ) {
		$args['post_type'] = $post_type;
	} else {
		return 'Select post type';
	}
	if ( $post_taxs !== '' && $post_category !== '' ) {
		$args['tax_query'] = array(  // phpcs:ignore
			array(
				'taxonomy'         => $post_taxs,
				'terms'            => $post_category,
				'field'            => 'slug',
				'include_children' => true,
				'operator'         => 'IN'
			)
		);
	}
	if ( ! empty( $exclude_post ) ) {
		$exclude_post         = explode( ",", $exclude_post );
		$args['post__not_in'] = $exclude_post;
	}
	ob_start();
	$query = new WP_Query( $args );
	if ( $query->have_posts() ) {
		?>
        <div class="news-post">
			<?php
			while ( $query->have_posts() ) {
				$query->the_post();
				$post_terms = wp_get_post_terms( get_the_ID(), 'category' );
				$cats       = array();
				foreach ( $post_terms as $post_term ) {
					$cats[] = $post_term->name;
				}
				$categories     = implode( ',', $cats );
				$post_image     = get_the_post_thumbnail_url();
				$post_permalink = get_the_permalink();
				$short_content  = get_the_excerpt();
				$post_title     = get_the_title();
				?>
                <div class="news-item <?php echo esc_attr( $layout ); ?>">
                    <div class="news-item-inner">
						<?php if ( ! empty( $post_image ) ): ?>
                            <div class="post-thumbnail">
                                <a href="<?php echo esc_url( $post_permalink ); ?>">
                                    <img alt="post-featured-image" width="520" height="245"
                                         src="<?php echo esc_url( $post_image ); ?>"/>
                                </a>
                            </div>
						<?php
						endif;
						?>
                        <div class="news-details">
							<?php if ( ! empty( $categories ) ): ?>
                                <span class="category">
                            <a href="#"><?php echo esc_html( $categories ); ?></a>
                            <time class="published updated"
                                  datetime="<?php echo get_the_date( 'F j, Y' ); ?>"><?php echo get_the_date( 'F j, Y' ); ?></time>
                        </span>
							<?php endif;

							if ( ! empty( $post_title ) ):?>
                                <h2 class="title"><a
                                            href="<?php echo esc_url( $post_permalink ); ?>"><?php echo esc_html( $post_title ); ?></a>
                                </h2>
							<?php endif;

							if ( ! empty( $short_content ) ): ?>
                                <p><?php echo esc_html( $short_content ); ?>...</p>
							<?php endif; ?>

                        </div>
                    </div>
                </div>
				<?php
			}
			?>
        </div>
		<?php
	} else { ?>
        <div class="news-post">
            <?php esc_html_e( 'No post found..!', 'post-filter-block' ); ?>
        </div>
		<?php
	}
	wp_reset_postdata();

	return ob_get_clean();

}

/**
 * Adding API routes for post filter.
 */
function pfb_post_filter_register_rest_route() {
	$register_routes = array(
		'/posttypes/'  => array( 'GET', 'pfb_post_filter_get_post_type' ),
		'/post_taxs/'  => array( 'GET', 'pfb_post_filter_get_post_taxts' ),
		'/categories/' => array( 'GET', 'pfb_post_filter_get_post_categories' ),
	);
	foreach ( $register_routes as $rout => $para ) {
		register_rest_route( 'postfilter_apis', $rout, array( 'methods' => $para[0], 'callback' => $para[1] ) );
	}
}

add_action( 'rest_api_init', 'pfb_post_filter_register_rest_route' );

/**
 * Adding options for select post type setting HTML.
 *
 * @return array
 */
function pfb_post_filter_get_post_type() {
	$args                = array(
		'public'   => true,
		'_builtin' => false
	);
	$output              = 'objects';
	$operator            = 'and';
	$post_types          = get_post_types( $args, $output, $operator );
	$posttype_with_lable = array(
		array(
			'label' => esc_html__( 'Select Post Type', 'post-filter-block' ),
			'value' => ''
		),
		array(
			'label' => 'Post',
			'value' => 'post'
		)
	);
	foreach ( $post_types as $post_type ) {
		$posttype_with_lable[] = array(
			'label' => $post_type->label,
			'value' => $post_type->name
		);
	}

	return $posttype_with_lable;
}

/**
 * Adding options for select taxonomy setting HTML.
 *
 * @param $request
 *
 * @return array
 */
function pfb_post_filter_get_post_taxts( $request ) {
	$taxonomy_objects = get_object_taxonomies( $request['post_type'], 'objects' );
	$post_taxs        = array(
		array(
			'label' => esc_html__( 'Select Taxonomy', 'post-filter-block' ),
			'value' => ''
		)
	);
	foreach ( $taxonomy_objects as $taxonomy_object ) {
		$post_taxs[] = array(
			'label' => $taxonomy_object->label,
			'value' => $taxonomy_object->name
		);
	}

	return $post_taxs;
}

/**
 * Adding options for select category setting HTML.
 *
 * @param $request
 *
 * @return array
 */
function pfb_post_filter_get_post_categories( $request ) {
	$terms      = get_terms( array(
		'taxonomy'   => $request['tax'],
		'hide_empty' => false,
	) );
	$post_terms = array(
		array(
			'label' => esc_html__( 'Select Category', 'post-filter-block' ),
			'value' => ''
		)
	);
	foreach ( $terms as $term ) {
		$post_terms[] = array(
			'label' => $term->name,
			'value' => $term->slug
		);
	}

	return $post_terms;
}

/**
 * Add new block category.
 *
 * @param array $default_categories
 *
 * @return array
 */
function pfb_block_category( $default_categories = array() ) {

	$default_categories[] = array(
		'slug'  => 'postfilter',
		'title' => esc_html__( 'Post Filter', 'post-filter-block' ),
	);

	return $default_categories;

}

add_filter( 'block_categories', 'pfb_block_category', 10 );