/* eslint-disable max-len */
import React, { Component } from 'react';
import { uid } from 'react-uid';

import { Props, DefaultProps } from '../constants';
import Wrapper from '../Wrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uid({ iconGradientStart: iconGradientStop });
  return `<canvas width="102" height="32" aria-hidden="true"></canvas>
  <svg viewBox="0 0 102 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" focusable="false" aria-hidden="true">
      <title>lockup/trello</title>
      <defs>
      <linearGradient x1="50%" x2="50%" y1="109.344%" y2="50%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
      <g stroke="none" stroke-width="1" fill-rule="nonzero">
           <path d="M52.3225806,10.7518395 L52.3225806,12.9465022 C49.4678051,12.6495249 47.7278077,13.5226383 47.7278077,16.2904674 L47.7278077,24 L45.5483871,24 L45.5483871,10.9329957 L47.7278077,10.9329957 L47.7278077,13.2345703 C48.4798405,11.6932577 49.7774657,10.5944415 52.3225806,10.7518395 Z M85.7368169,10.7368421 C89.7172703,10.7368421 92,13.5146033 92,17.3380076 C92,21.1614119 89.6901308,24 85.7368169,24 C81.7835029,24 79.4193548,21.1614119 79.4193548,17.3380076 C79.4193548,13.5146033 81.7563635,10.7368421 85.7368169,10.7368421 Z M59.3551956,10.7368421 C63.3118171,10.7368421 64.9032258,13.4624659 64.9032258,17.3380076 L64.9032258,18.3430995 L55.5241347,18.3430995 C55.8336564,20.5096953 57.2469441,21.9116102 60.2779206,21.9116102 C61.610916,21.9107657 62.9333788,21.6774223 64.1849019,21.2222388 L64.1849019,23.2498017 C63.1307762,23.7972437 61.5130873,24 60.2020002,24 C55.3985741,24 53.2903226,21.2483075 53.2903226,17.3380076 C53.2903226,13.4885346 55.4482143,10.7368421 59.3551956,10.7368421 Z M44.5806452,7.89473684 L44.5806452,10.0036599 L39.440885,10.0036599 L39.440885,24 L37.1397601,24 L37.1397601,10.0036599 L32,10.0036599 L32,7.89473684 L44.5806452,7.89473684 Z M76.9132626,6 L76.9132626,20.433787 C76.9132626,21.5827452 77.7310727,21.9762634 78.7378464,21.9762634 C78.9653661,21.9800456 79.1929286,21.9714135 79.4193548,21.9504118 L79.4193548,23.8978959 C79.0294562,23.9742026 78.6312672,24.0079433 78.2329107,23.9984297 C75.996324,23.9984297 74.5806452,23.0131981 74.5806452,20.6865578 L74.5806452,6 L76.9132626,6 Z M69.1777283,6 L69.1777283,20.4334785 C69.1777283,21.5824121 69.9934495,21.9759219 70.9976517,21.9759219 C71.2245909,21.9797573 71.4515755,21.9711253 71.6774194,21.9500709 L71.6774194,23.8975134 C71.28454,23.9750651 70.8831182,24.0088137 70.4816463,23.9980451 C68.2538623,23.9980451 66.8387097,23.0128345 66.8387097,20.6862439 L66.8387097,6 L69.1777283,6 Z M85.7368169,12.7759911 C82.9112981,12.7759911 81.6508211,14.9136217 81.6508211,17.3380076 C81.6508211,19.759497 82.8962206,21.949265 85.7368169,21.949265 C88.5774132,21.949265 89.7685337,19.759497 89.7685337,17.3380076 C89.7685337,14.9165182 88.5623357,12.7759911 85.7368169,12.7759911 Z M59.250075,12.7470259 C56.9140623,12.7354398 55.7314559,14.2387329 55.5007746,16.457466 L55.5007746,16.4690521 L62.6694136,16.4690521 C62.5409329,14.0968035 61.4605271,12.7470259 59.250075,12.7470259 Z" fill="inherit" fill-rule="nonzero"></path>
        <path d="M20.9965006,4 L2.99950008,4 C1.34292193,4 0,5.34314812 0,7 L0,25 C0,26.6568519 1.34292193,28 2.99950008,28 L20.9965006,28 C21.7927102,28.0010591 22.5566726,27.6854575 23.1200533,27.1227333 C23.6834339,26.5600092 24,25.7963408 24,25 L24,7 C24,6.20365918 23.6834339,5.4399908 23.1200533,4.87726666 C22.5566726,4.31454253 21.7927102,3.99894088 20.9965006,4 Z M11,21.6181465 C10.988052,22.384452 10.2853671,23 9.42271983,23 L4.57291098,23 C3.70421623,23 3,22.3743717 3,21.6026201 L3,21.6026201 L3,8.39737991 C3,8.02677172 3.16571693,7.67134267 3.46069496,7.4092831 C3.75567299,7.14722353 4.15574905,7 4.57291098,7 L9.42271983,7 C10.2921242,7 10.9975917,7.62500084 11,8.39737991 L11,21.6181465 Z M21,16.492003 C21,16.8919487 20.8341925,17.2755136 20.5390533,17.5583179 C20.2439141,17.8411222 19.8436194,18 19.4262295,18 L14.5737705,18 C13.704601,18 13,17.3248468 13,16.492003 L13,8.50799695 C13,8.10805129 13.1658075,7.72448637 13.4609467,7.44168208 C13.7560859,7.15887779 14.1563806,7 14.5737705,7 L19.4262295,7 C19.8436194,7 20.2439141,7.15887779 20.5390533,7.44168208 C20.8341925,7.72448637 21,8.10805129 21,8.50799695 L21,8.50799695 L21,16.492003 Z" fill="url(#${id})" fill-rule="nonzero"></path>
    </g>
  </svg>`;
};

export default class TrelloLogo extends Component<Props> {
  static defaultProps = DefaultProps;

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
