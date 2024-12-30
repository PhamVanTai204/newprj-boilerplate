import { newprjTemplatePage } from './app.po';

describe('newprj App', function() {
  let page: newprjTemplatePage;

  beforeEach(() => {
    page = new newprjTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
