/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { testDataProcessor as test } from '../../tests/_utils/utils';

describe( 'GFMDataProcessor', () => {
	describe( 'links', () => {
		it( 'should not autolink', () => {
			test(
				'Link: http://example.com/.',
				'<p>Link: http://example.com/.</p>'
			);
		} );

		it( 'should not autolink with params', () => {
			test(
				'Link: http://example.com/?foo=1&bar=2.',
				'<p>Link: http://example.com/?foo=1&bar=2.</p>'
			);
		} );

		it( 'should not autolink inside list', () => {
			test(
				'*   http://example.com/',
				'<ul><li>http://example.com/</li></ul>',
			);
		} );

		it( 'should not autolink inside blockquote', () => {
			test(
				'> Blockquoted: http://example.com/',

				'<blockquote>' +
				'<p>Blockquoted: http://example.com/</p>' +
				'</blockquote>',
			);
		} );

		it( 'should not autolink inside inline code', () => {
			test(
				'`<http://example.com/>`',
				'<p><code><http://example.com/></code></p>'
			);
		} );

		it( 'should not autolink inside code block', () => {
			test(
				'	<http://example.com/>',
				'<pre><code><http://example.com/></code></pre>',

				// When converting back, code block will be normalized to ```.
				'```\n' +
				'<http://example.com/>\n' +
				'```'
			);
		} );

		it( 'should not process already linked #1', () => {
			test(
				'Already linked: [http://example.com/](http://example.com/)',
				'<p>Already linked: <a href="http://example.com/">http://example.com/</a></p>'
			);
		} );

		it( 'should not process already linked #2', () => {
			test(
				'Already linked: [**http://example.com/**](http://example.com/)',
				'<p>Already linked: <a href="http://example.com/"><strong>http://example.com/</strong></a></p>'
			);
		} );

		it( 'should process inline links', () => {
			test(
				'[URL](/url/)',
				'<p><a href="/url/">URL</a></p>'
			);
		} );

		it( 'should process inline links with title', () => {
			test(
				'[URL and title](/url/ "title")',
				'<p><a href="/url/" title="title">URL and title</a></p>'
			);
		} );

		it( 'should process inline links with title preceded by two spaces', () => {
			test(
				'[URL and title](/url/  "title preceded by two spaces")',
				'<p><a href="/url/" title="title preceded by two spaces">URL and title</a></p>',

				// When converting back spaces will be normalized to one space.
				'[URL and title](/url/ "title preceded by two spaces")'
			);
		} );

		it( 'should process inline links with title preceded by tab', () => {
			test(
				'[URL and title](/url/	"title preceded by tab")',
				'<p><a href="/url/" title="title preceded by tab">URL and title</a></p>',

				// When converting back tab will be normalized to one space.
				'[URL and title](/url/ "title preceded by tab")'
			);
		} );

		it( 'should process inline links with title that has spaces afterwards', () => {
			test(
				'[URL and title](/url/ "title has spaces afterward"  )',
				'<p><a href="/url/" title="title has spaces afterward">URL and title</a></p>',

				// When converting back spaces will be removed.
				'[URL and title](/url/ "title has spaces afterward")'
			);
		} );

		// it( 'should process empty link', () => {
		// 	test(
		// 		'[Empty]()',
		//
		// 		'<p><a href="">Empty</a></p>'
		// 	);
		// } );

		it( 'should process reference links', () => {
			test(
				'Foo [bar][1].\n\n' +
				'[1]: /url/  "Title"',

				'<p>Foo <a href="/url/" title="Title">bar</a>.</p>',

				// After converting back reference links will be converted to normal links.
				// This might be a problem when switching between source and editor.
				'Foo [bar](/url/ "Title").'
			);
		} );

		it( 'should process reference links - without space', () => {
			test(
				'Foo [bar][1].\n\n' +
				'[1]: /url/  "Title"',

				'<p>Foo <a href="/url/" title="Title">bar</a>.</p>',

				'Foo [bar](/url/ "Title").'
			);
		} );

		it( 'should process reference links - with embedded brackets', () => {
			test(
				'With [embedded [brackets]][b].\n\n' +
				'[b]: /url/',

				'<p>With <a href="/url/">embedded [brackets]</a>.</p>',

				'With [embedded \\[brackets\\]](/url/).'
			);
		} );

		it( 'should process reference links - with reference indented once', () => {
			test(
				'Indented [once][].\n\n' +
				' [once]: /url',

				'<p>Indented <a href="/url">once</a>.</p>',

				'Indented [once](/url).'
			);
		} );

		it( 'should process reference links - with reference indented twice', () => {
			test(
				'Indented [twice][].\n\n' +
				'  [twice]: /url',

				'<p>Indented <a href="/url">twice</a>.</p>',

				'Indented [twice](/url).'
			);
		} );

		it( 'should process reference links - with reference indented three times', () => {
			test(
				'Indented [trice][].\n\n' +
				'   [trice]: /url',

				'<p>Indented <a href="/url">trice</a>.</p>',

				'Indented [trice](/url).'
			);
		} );

		it( 'should process reference links when title and reference are same #1', () => {
			test(
				'[this][this]\n\n' +
				'[this]: foo',

				'<p><a href="foo">this</a></p>',

				'[this](foo)'
			);
		} );

		it( 'should process reference links when title and reference are same #2', () => {
			test(
				'[this][this]\n\n' +
				'[this]: foo',

				'<p><a href="foo">this</a></p>',

				'[this](foo)'
			);
		} );

		it( 'should process reference links when only title is provided and is same as reference #1', () => {
			test(
				'[this][]\n\n' +
				'[this]: foo',

				'<p><a href="foo">this</a></p>',

				'[this](foo)'
			);
		} );

		it( 'should process reference links when only title is provided and is same as reference #2', () => {
			test(
				'[this][]\n\n' +
				'[this]: foo',

				'<p><a href="foo">this</a></p>',

				'[this](foo)'
			);
		} );

		it( 'should process reference links when only title is provided and is same as reference #3', () => {
			test(
				'[this]\n\n' +
				'[this]: foo',

				'<p><a href="foo">this</a></p>',

				'[this](foo)'
			);
		} );

		it( 'should not process reference links when reference is not found #1', () => {
			test(
				'[this][]',

				'<p>[this][]</p>',

				'\\[this\\]\\[\\]'
			);
		} );

		it( 'should not process reference links when reference is not found #2', () => {
			test(
				'[this]',

				'<p>[this]</p>',

				'\\[this\\]'
			);
		} );

		it( 'should process reference links nested in brackets #1', () => {
			test(
				'[a reference inside [this][]]\n\n' +
				'[this]: foo',

				'<p>[a reference inside <a href="foo">this</a>]</p>',

				'\\[a reference inside [this](foo)\\]'
			);
		} );

		it( 'should process reference links nested in brackets #2', () => {
			test(
				'[a reference inside [this]]\n\n' +
				'[this]: foo',

				'<p>[a reference inside <a href="foo">this</a>]</p>',

				'\\[a reference inside [this](foo)\\]'
			);
		} );

		it( 'should not process reference links when title is same as reference but reference is different', () => {
			test(
				'[this](/something/else/)\n\n' +
				'[this]: foo',

				'<p><a href="/something/else/">this</a></p>',

				'[this](/something/else/)'
			);
		} );

		it( 'should not process reference links suppressed by backslashes', () => {
			test(
				'Suppress \\[this] and [this\\].\n\n' +
				'[this]: foo',

				'<p>Suppress [this] and [this].</p>',

				'Suppress \\[this\\] and \\[this\\].'
			);
		} );

		it( 'should process reference links when used across multiple lines #1', () => {
			test(
				'This is [multiline\n' +
				'reference]\n\n' +
				'[multiline reference]: foo',

				'<p>This is <a href="foo">multiline<br></br>reference</a></p>',

				'This is [multiline\n' +
				'reference](foo)'
			);
		} );

		it( 'should process reference links when used across multiple lines #2', () => {
			test(
				'This is [multiline \n' +
				'reference]\n\n' +
				'[multiline reference]: foo',

				'<p>This is <a href="foo">multiline<br></br>reference</a></p>',

				'This is [multiline\n' +
				'reference](foo)'
			);
		} );

		it( 'should process reference links case-insensitive', () => {
			test(
				'[hi]\n\n' +
				'[HI]: /url',

				'<p><a href="/url">hi</a></p>',

				'[hi](/url)'
			);
		} );
	} );
} );
