import { browser, element, by } from 'protractor';

export class DemoPage {
  navigateTo() {
    return browser.get('/');
  }

  getCopyright() {
    return element(by.css('app-root div.copyright')).getText();
  }
}
