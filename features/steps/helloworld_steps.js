module.exports = function() {

  this.Given(/^I have visited the index page$/, function () {
    browser.url('localhost:8080/public/index.html');
  });

  this.When(/^I enter (.+)$/, function (text) {
    browser.setValue('input[name="hello-text"]', text);
  });
  
  this.Then(/^I see (.+)$/, function (text) {
    browser.waitForExist('.hello=' + text, 1000);
  });
}