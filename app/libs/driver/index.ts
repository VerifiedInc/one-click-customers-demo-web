import { LinksFunction } from '@remix-run/node';
import { driver as driverJS } from 'driver.js';
import driverStyles from 'driver.js/dist/driver.css';
import customDriverStyles from './style.css';

export const driverLinks: LinksFunction = () => [
  { rel: 'stylesheet', href: driverStyles },
  { rel: 'stylesheet', href: customDriverStyles },
];

export const driver = driverJS;
