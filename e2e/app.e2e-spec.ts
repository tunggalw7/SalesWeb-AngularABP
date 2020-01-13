import { DemoPage } from './app.po';

describe('abp-zero-template App', function () {
    let page: DemoPage;

    beforeEach(() => {
        page = new DemoPage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        page.getCopyright().then(value => {
            expect(value).toEqual(new Date().getFullYear() + ' © Demo.');
        });
    });
});
