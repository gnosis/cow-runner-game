'use strict';

import { Runner } from 'game'


function onDocumentLoad() {
  new Runner('.interstitial-wrapper');
}

document.addEventListener('DOMContentLoaded', onDocumentLoad);
