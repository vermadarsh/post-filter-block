/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var __ = wp.i18n.__;
var registerBlockType = wp.blocks.registerBlockType;
var _wp = wp,
    apiFetch = _wp.apiFetch;
var Fragment = wp.element.Fragment;
var _wp$editor = wp.editor,
    RichText = _wp$editor.RichText,
    InspectorControls = _wp$editor.InspectorControls,
    MediaUpload = _wp$editor.MediaUpload,
    BlockControls = _wp$editor.BlockControls,
    InnerBlocks = _wp$editor.InnerBlocks,
    AlignmentToolbar = _wp$editor.AlignmentToolbar,
    PanelColorSettings = _wp$editor.PanelColorSettings;
var _wp$components = wp.components,
    PanelBody = _wp$components.PanelBody,
    TextControl = _wp$components.TextControl,
    Button = _wp$components.Button,
    SelectControl = _wp$components.SelectControl,
    RangeControl = _wp$components.RangeControl,
    ToggleControl = _wp$components.ToggleControl,
    ServerSideRender = _wp$components.ServerSideRender,
    ColorPalette = _wp$components.ColorPalette,
    TextareaControl = _wp$components.TextareaControl,
    RadioControl = _wp$components.RadioControl;


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
    edit: function edit(props) {
        var _props$attributes = props.attributes,
            number_of_post = _props$attributes.number_of_post,
            post_type = _props$attributes.post_type,
            post_type_obj = _props$attributes.post_type_obj,
            post_taxs = _props$attributes.post_taxs,
            post_taxs_obj = _props$attributes.post_taxs_obj,
            post_category = _props$attributes.post_category,
            post_category_obj = _props$attributes.post_category_obj,
            layout = _props$attributes.layout,
            exclude_post = _props$attributes.exclude_post,
            setAttributes = props.setAttributes;

        var get_post_taxs = function get_post_taxs(newContent) {
            setAttributes({ post_type: newContent });
            var url = "/wp-json/postfilter_apis/post_taxs?post_type=" + newContent;
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (json) {
                setAttributes({ post_taxs_obj: json });
                setAttributes({ post_taxs: '' });
                setAttributes({ post_category: '' });
            });
            console.log(post_taxs_obj);
        };
        var get_post_categories = function get_post_categories(newContent) {
            setAttributes({ post_taxs: newContent });
            var url = "/wp-json/postfilter_apis/categories?tax=" + newContent;
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (json) {
                setAttributes({ post_category_obj: json });
                setAttributes({ post_category: '' });
            });
            console.log(post_category_obj);
        };
        var url = "/wp-json/postfilter_apis/posttypes";
        fetch(url).then(function (response) {
            return response.json();
        }).then(function (json) {
            setAttributes({ post_type_obj: json });
        });

        return [wp.element.createElement(
            Fragment,
            null,
            wp.element.createElement(
                InspectorControls,
                { key: "Post Filter" },
                wp.element.createElement(
                    PanelBody,
                    { title: "Select Filter", initialOpen: "true" },
                    wp.element.createElement(SelectControl, {
                        label: "Post type",
                        value: post_type,
                        options: post_type_obj,
                        onChange: get_post_taxs
                    }),
                    wp.element.createElement(SelectControl, {
                        label: "Taxonomies",
                        value: post_taxs,
                        options: post_taxs_obj,
                        onChange: get_post_categories
                    }),
                    wp.element.createElement(SelectControl, {
                        label: "Categories",
                        value: post_category,
                        options: post_category_obj,
                        onChange: function onChange(value) {
                            return setAttributes({ post_category: value });
                        }
                    }),
                    wp.element.createElement(RangeControl, {
                        label: "Number of Posts",
                        value: number_of_post,
                        onChange: function onChange(value) {
                            return setAttributes({ number_of_post: value });
                        },
                        min: 1,
                        max: 100
                    }),
                    wp.element.createElement(RadioControl, {
                        label: "Select Layout",
                        selected: layout,
                        options: [{
                            label: "Grid",
                            value: ""
                        }, {
                            label: "Large Size",
                            value: "full-width"
                        }],
                        onChange: function onChange(value) {
                            return setAttributes({ layout: value });
                        }
                    }),
                    wp.element.createElement(TextareaControl, {
                        label: "Exclude Posts",
                        help: "Add post-id here for exclude the post (example 1,2..)",
                        tagName: "p",
                        className: "section-title",
                        value: exclude_post,
                        onChange: function onChange(value) {
                            return setAttributes({ exclude_post: value });
                        }
                    })
                )
            ),
            wp.element.createElement(ServerSideRender, {
                block: "postfilter/posts-filter",
                attributes: {
                    post_type: post_type,
                    post_taxs: post_taxs,
                    post_category: post_category,
                    number_of_post: number_of_post,
                    layout: layout,
                    exclude_post: exclude_post
                }
            })
        )];
    },
    save: function save(props) {
        // Rendering in PHP
        return null;
    }
});

/***/ })
/******/ ]);