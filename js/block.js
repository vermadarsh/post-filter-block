const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { apiFetch } = wp;
const { Fragment } = wp.element;
const {
    RichText,
    InspectorControls,
    MediaUpload,
    BlockControls,
    InnerBlocks,
    AlignmentToolbar,
    PanelColorSettings
} = wp.editor;
const {
    PanelBody,
    TextControl,
    Button,
    SelectControl,
    RangeControl,
    ToggleControl,
    ServerSideRender,
    ColorPalette,
    TextareaControl,
    RadioControl
} = wp.components;

/**
 * Register block type (Posts Filter)
 */
registerBlockType("postfilter/posts-filter", {
    title: "Posts Filter",
    icon: "image-filter",
    category: "postfilter",
    attributes: {

        number_of_post: {
            type: "number",
            default: "1"
        },
        post_type: {
            default: "",
            type: "string"
        },
        post_type_obj: {
            type: "json"
        },
        post_taxs: {
            default: "",
            type: "string"
        },
        post_taxs_obj: {
            default: [{ label: "--Select Taxonomy--", value: "" }],
            type: "json"
        },
        post_category: {
            default: "",
            type: "string"
        },
        post_category_obj: {
            default: [{ label: "--Select Category--", value: "" }],
            type: "json"
        },
        layout: {
            type: "string",
            default: ""
        },
        exclude_post: { type: "string" }
    },
    edit: function(props) {
        const {
            attributes: {

                number_of_post,
                post_type,
                post_type_obj,
                post_taxs,
                post_taxs_obj,
                post_category,
                post_category_obj,
                layout,
                exclude_post
            },
            setAttributes
        } = props;
        var get_post_taxs = function get_post_taxs(newContent) {
            setAttributes({ post_type: newContent });
            var url = "/wp-json/postfilter_apis/post_taxs?post_type=" + newContent;
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    setAttributes({ post_taxs_obj: json });
                    setAttributes({ post_taxs: '' });
                    setAttributes({ post_category: '' });
                });
            console.log(post_taxs_obj);
        };
        var get_post_categories = function get_post_categories(newContent) {
            setAttributes({ post_taxs: newContent });
            var url = "/wp-json/postfilter_apis/categories?tax=" + newContent;
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    setAttributes({ post_category_obj: json });
                    setAttributes({ post_category: '' });
                });
            console.log(post_category_obj);
        };
        var url = "/wp-json/postfilter_apis/posttypes";
        fetch(url)
            .then(response => response.json())
            .then(json => {
                setAttributes({ post_type_obj: json });

            });

        return [
            <Fragment>

                <InspectorControls key="Post Filter">
                    <PanelBody title="Select Filter" initialOpen="true">
                        <SelectControl
                            label="Post type"
                            value={post_type}
                            options={post_type_obj}
                            onChange={get_post_taxs}
                        />
                        <SelectControl
                            label="Taxonomies"
                            value={post_taxs}
                            options={post_taxs_obj}
                            onChange={get_post_categories}
                        />
                        <SelectControl
                            label="Categories"
                            value={post_category}
                            options={post_category_obj}
                            onChange={value => setAttributes({ post_category: value })}
                        />
                        <RangeControl
                            label="Number of Posts"
                            value={number_of_post}
                            onChange={value => setAttributes({ number_of_post: value })}
                            min={1}
                            max={100}
                        />
                        <RadioControl
                            label="Select Layout"
                            selected={layout}
                            options={[
                                {
                                    label: "Grid",
                                    value: ""
                                },
                                {
                                    label: "Large Size",
                                    value: "full-width"
                                }
                            ]}
                            onChange={value => setAttributes({ layout: value })}
                        />

                            <TextareaControl
                                label="Exclude Posts"
                                help="Add post-id here for exclude the post (example 1,2..)"
                                tagName="p"
                                className="section-title"
                                value={exclude_post}
                                onChange={value => setAttributes({ exclude_post: value })}
                            />
                    </PanelBody>
                </InspectorControls>
                <ServerSideRender
                    block="postfilter/posts-filter"
                    attributes={{
                        post_type: post_type,
                        post_taxs: post_taxs,
                        post_category: post_category,
                        number_of_post: number_of_post,
                        layout: layout,
                        exclude_post: exclude_post
                    }}
                />
            </Fragment>
        ];
    },
    save: function(props) {
        // Rendering in PHP
        return null;
    }
});
