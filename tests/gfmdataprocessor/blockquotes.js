/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { testDataProcessor as test } from '../../tests/_utils/utils';

describe( 'GFMDataProcessor', () => {
	describe( 'blockquotes', () => {
		it( 'should process single blockquotes', () => {
			test(
				'> foo bar',

				// GitHub is rendering as:
				//
				// <blockquote>
				// <p>foo bar</p>
				// </blockquote>
				'<blockquote><p>foo bar</p></blockquote>'
			);
		} );

		it( 'should process nested blockquotes', () => {
			test(
				'> foo\n' +
				'> \n' +
				'> > bar\n' +
				'> \n' +
				'> foo',

				// GitHub is rendering as:
				// <blockquote>
				// <p>foo</p>
				//
				// <blockquote>
				// <p>bar</p>
				// </blockquote>
				//
				// <p>foo</p>
				// </blockquote>
				'<blockquote>' +
					'<p>foo</p>' +
					'<blockquote>' +
						'<p>bar</p>' +
					'</blockquote>' +
					'<p>foo</p>' +
				'</blockquote>'
			);
		} );

		it( 'should process list within a blockquote', () => {
			test(
				'> A list within a blockquote:\n' +
				'> \n' +
				'> *   asterisk 1\n' +
				'> *   asterisk 2\n' +
				'> *   asterisk 3',

				// GitHub is rendering as:
				// <blockquote>
				// <p>A list within a blockquote:</p>
				//
				// <ul>
				// <li>asterisk 1</li>
				// <li>asterisk 2</li>
				// <li>asterisk 3</li>
				// </ul>
				// </blockquote>
				'<blockquote>' +
					'<p>A list within a blockquote:</p>' +
					'<ul>' +
						'<li>asterisk 1</li>' +
						'<li>asterisk 2</li>' +
						'<li>asterisk 3</li>' +
					'</ul>' +
				'</blockquote>'
			);
		} );

		it( 'should process blockquotes with code inside with ```', () => {
			test(
				'> Example 1:\n' +
				'> \n' +
				'> ```\n' +
				'> code 1\n' +
				'> ```\n' +
				'> \n' +
				'> Example 2:\n' +
				'> \n' +
				'> ```\n' +
				'> code 2\n' +
				'> ```',

				// GitHub is rendering as:
				// <blockquote>
				// <p>Example 1:</p>
				//
				// <pre><code>code 1
				// </code></pre>
				//
				// <p>Example 2:</p>
				//
				// <pre><code>code 2
				// </code></pre>
				// </blockquote>
				'<blockquote>' +
					'<p>Example 1:</p>' +
					'<pre>' +
						'<code>' +
							'code 1' +
						'</code>' +
					'</pre>' +
					'<p>Example 2:</p>' +
					'<pre>' +
						'<code>' +
							'code 2' +
						'</code>' +
					'</pre>' +
				'</blockquote>'
			);
		} );

		it( 'should process blockquotes with code inside with tabs', () => {
			test(
				'> Example 1:\n' +
				'>\n' +
				'>     code 1\n' +
				'>\n' +
				'> Example 2:\n' +
				'>\n' +
				'>     code 2\n',

				// GitHub is rendering as:
				// <blockquote>
				// <p>Example 1:</p>
				//
				// <pre><code>code 1
				// </code></pre>
				//
				// <p>Example 2:</p>
				//
				// <pre><code>code 2
				// </code></pre>
				// </blockquote>
				'<blockquote>' +
					'<p>Example 1:</p>' +
					'<pre>' +
						'<code>' +
							'code 1' +
						'</code>' +
					'</pre>' +
					'<p>Example 2:</p>' +
					'<pre>' +
						'<code>' +
							'code 2' +
						'</code>' +
					'</pre>' +
				'</blockquote>',

				// When converting back to data, DataProcessor will normalize tabs to ```.
				'> Example 1:\n' +
				'> \n' +
				'> ```\n' +
				'> code 1\n' +
				'> ```\n' +
				'> \n' +
				'> Example 2:\n' +
				'> \n' +
				'> ```\n' +
				'> code 2\n' +
				'> ```'
			);
		} );
	} );
} );
