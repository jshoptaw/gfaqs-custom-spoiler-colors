// ==UserScript==
// @name            GameFAQs Custom Spoiler Colors
// @namespace       OTACON120
// @author          OTACON120
// @license         http://opensource.org/licenses/MIT
// @version         1.0
// @description     Allow specification of GameFAQs spoiler tag colors
// @updateURL       https://greasyfork.org/scripts/6426-gamefaqs-custom-spoiler-colors/code/GameFAQs%20Custom%20Spoiler%20Colors.meta.js
// @downloadURL     https://greasyfork.org/scripts/6426-gamefaqs-custom-spoiler-colors/code/GameFAQs%20Custom%20Spoiler%20Colors.user.js
// @website         http://otacon120.com/scripts/custom-spoiler-colors/
// @contributionURL https://www.paypal.com/us/cgi-bin/webscr?cmd=_flow&SESSION=LgkxqunuQlKnhicHni4dzQajlENrZQbtNOuCyKJcbq1o5msoIEB0UyzAZYS&dispatch=5885d80a13c0db1f8e263663d3faee8dbd0a2170b502f343d92a90377a9956d7
// @include         http://www.gamefaqs.com/*
// @match           http://www.gamefaqs.com/*
// @grant           none
// @require         https://greasyfork.org/scripts/6414-grant-none-shim/code/%22@grant%20none%22%20Shim.js
// ==/UserScript==
var spColorSettings = JSON.parse( GM_getValue( 'o120-spoiler-colors', JSON.stringify( {
		bg:    '#222222',
		text:  '#ffffff',
		reveal: '0'
	} ) ) ),
	spoilerCSS      = document.createElement( 'style' );

/**
 * Function for dynamically changing spoiler preview color on settings page
 */
function changeSpoilerColor( bg, text ) {
	spoilerCSS.textContent = '\
		s, s a, s a:visited, s blockquote {\
			background-color: ' + bg + ';\
			color: ' + ( spColorSettings.reveal !== '2' ? bg : text ) + ' !important;\
		}\
		\
		s:hover, s:hover a, s:hover blockquote {\
			background-color: ' + bg + ';\
			color: ' + ( spColorSettings.reveal !== '0' ? text : bg ) + ' !important;\
		}';
}

// Spoiler color CSS using regular <style> tag instead of GM_addStyle to allow for easy overriding of settings page spoiler preview
spoilerCSS.id = "o120-spoiler-color-css";
spoilerCSS.textContent = '\
s, s a, s a:visited, s blockquote {\
	background-color: ' + spColorSettings.bg + ';\
	color: ' + ( spColorSettings.reveal !== '2' ? spColorSettings.bg : spColorSettings.text ) + ' !important;\
}\
\
s:hover, s:hover a, s:hover blockquote {\
	background-color: ' + spColorSettings.bg + ';\
	color: ' + ( spColorSettings.reveal !== '0' ? spColorSettings.text : spColorSettings.bg ) + ' !important;\
}';

document.head.appendChild( spoilerCSS );

/**
 * Settings Page
 */
if ( window.location.href === 'http://www.gamefaqs.com/user/options_advanced.html' ) {
	var spColorRow      = {
			contain:    document.createElement( 'div' ),
			namelarge:  {
				contain: document.createElement( 'div' ),
				tooltip: document.createElement( 'i' )
			},
			optionlarge: {
				contain: document.createElement( 'div' ),
				inputs:   {
					labels: {
						bg:   {
							text:    document.createTextNode( 'BG:' ),
							tooltip: document.createElement( 'i' )
						},
						text: {
							text:    document.createTextNode( 'Text:' ),
							tooltip: document.createElement( 'i' )
						}
					},
					bg:     document.createElement( 'input' ),
					text:   document.createElement( 'input' )
				},
				preview: {
					label:   document.createTextNode( ' Preview: ' ),
					spoiler: document.createElement( 's' )
				}
			}
		},
		settingsForm       = document.getElementById( 'submit' ).form,
		rvlSpoilersRow     = $( '.namelarge:contains("Reveal Spoilers")' )[0].parentNode,
		rvlSetting         = rvlSpoilersRow.querySelector( 'select[name="resp"]' );

	spColorSettings.reveal = rvlSetting[ rvlSetting.selectedIndex ].value;

	/**
	 * Script-specific CSS
	 */
	GM_addStyle('\
	#o120-spoiler-bg-color {\
		margin: 0 5px 0 3px;\
	}\
	\
	#o120-spoiler-text-color {\
		margin: 0 7px 0 3px;\
	}');

	/**
	 * Build "Spoiler Color" setting row
	 */
		
	// Add necessary classes to conform to HTML structure
	spColorRow.contain.classList.add( 'row' );
	spColorRow.namelarge.contain.classList.add( 'namelarge' );
	spColorRow.namelarge.tooltip.classList.add( 'icon', 'icon-question-sign' );
	spColorRow.optionlarge.contain.classList.add( 'optionlarge' );

	// Set tooltip text
	spColorRow.namelarge.tooltip.title                    = 'Select a color for unrevealed spoilers';

	// Create setting label
	spColorRow.namelarge.contain.innerHTML                = 'Spoiler Color ';
	spColorRow.namelarge.contain.appendChild( spColorRow.namelarge.tooltip );

	// Build tooltip for "BG" label
	spColorRow.optionlarge.inputs.labels.bg.tooltip.classList.add( 'icon', 'icon-question-sign' );
	spColorRow.optionlarge.inputs.labels.bg.tooltip.title = 'Background Color';

	// Build tooltip for "Text" label
	spColorRow.optionlarge.inputs.labels.text.tooltip.classList.add( 'icon', 'icon-question-sign' );
	spColorRow.optionlarge.inputs.labels.text.tooltip.title = 'Text Color (When using "When I Hover Over Them" or "Always" settings for "Reveal Spoilers")';
		
	// Make inputs HTML5 "color" inputs and add proper attributes
	spColorRow.optionlarge.inputs.bg.type                   =
	spColorRow.optionlarge.inputs.text.type                 = 'color';

	spColorRow.optionlarge.inputs.bg.id                     = 'o120-spoiler-bg-color';
	spColorRow.optionlarge.inputs.text.id                   = 'o120-spoiler-text-color';

	spColorRow.optionlarge.inputs.bg.classList.add( 'btn', 'o120-spoiler-color-input' );
	spColorRow.optionlarge.inputs.text.classList.add( 'btn', 'o120-spoiler-color-input' );

	// Default/saved color on page load
	spColorRow.optionlarge.inputs.bg.value                  = spColorSettings.bg;
	spColorRow.optionlarge.inputs.text.value                = spColorSettings.text;

	// Add content to spoiler preview
	spColorRow.optionlarge.preview.spoiler.innerHTML        = 'Text | <a href="#">Link</a>';

	// Put it all together
	spColorRow.optionlarge.contain.appendChild( spColorRow.optionlarge.inputs.labels.bg.text );
	spColorRow.optionlarge.contain.appendChild( spColorRow.optionlarge.inputs.labels.bg.tooltip );
	spColorRow.optionlarge.contain.appendChild( spColorRow.optionlarge.inputs.bg );
	spColorRow.optionlarge.contain.appendChild( spColorRow.optionlarge.inputs.labels.text.text );
	spColorRow.optionlarge.contain.appendChild( spColorRow.optionlarge.inputs.labels.text.tooltip );
	spColorRow.optionlarge.contain.appendChild( spColorRow.optionlarge.inputs.text );
	spColorRow.optionlarge.contain.appendChild( spColorRow.optionlarge.preview.label );
	spColorRow.optionlarge.contain.appendChild( spColorRow.optionlarge.preview.spoiler );
	spColorRow.contain.appendChild( spColorRow.namelarge.contain );
	spColorRow.contain.appendChild( spColorRow.optionlarge.contain );

	// Place it after the "Reveal Spoilers" setting
	rvlSpoilersRow.parentNode.insertBefore( spColorRow.contain, rvlSpoilersRow.nextSibling );

	// Update reveal spoiler setting temporarily when it is changed
	rvlSetting.onchange = function() {
		spColorSettings.reveal = this[ this.selectedIndex ].value;

		changeSpoilerColor( spColorRow.optionlarge.inputs.bg.value, spColorRow.optionlarge.inputs.text.value );
	}

	/**
	 * Update preview color when changed
	 */
	spColorRow.optionlarge.inputs.bg.oninput   =
	spColorRow.optionlarge.inputs.text.oninput = function() {
		changeSpoilerColor( spColorRow.optionlarge.inputs.bg.value, spColorRow.optionlarge.inputs.text.value );
	}

	/**
	 * Save color upon saving settings
	 */
	settingsForm.onsubmit = function() {
		GM_setValue( 'o120-spoiler-colors', JSON.stringify( {
			bg:     spColorRow.optionlarge.inputs.bg.value,
			text:   spColorRow.optionlarge.inputs.text.value,
			reveal: rvlSetting[ rvlSetting.selectedIndex ].value
		} ) );
	}
}
