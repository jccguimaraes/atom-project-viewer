'use strict';

const colours = require('../src/colours');

describe ('module: colours', function () {

  describe ('on initialization', function () {

    it ('should add only one stylesheet', function () {
      colours.initialize();
      expect(colours.mapper.element).not.toBeUndefined();
      const styles = document.querySelector('head atom-styles').children.length;
      colours.initialize();
      const stylesEqual = document.querySelector('head atom-styles').children.length;

      expect(styles).toEqual(stylesEqual);
    });
  });

  describe ('on destruction', function () {

    it ('should remove the stylesheet', function () {
      colours.initialize();
      const styles = document.querySelector('head atom-styles').children.length;
      colours.destroy();
      const stylesEqual = document.querySelector('head atom-styles').children.length;

      expect(colours.mapper.element).toBeUndefined();
      expect(styles).not.toEqual(stylesEqual);
    });
  });

  describe ('setting a color', function () {

    it ('should add the rule', function () {
      colours.initialize();
      const id = 'pv_1';
      expect(colours.mapper.element.sheet.cssRules).toHaveLength(0);
      colours.addRule(id, 'group', '#ccc');
      expect(colours.mapper.element.sheet.cssRules).toHaveLength(1);
      expect(colours.mapper.element.sheet.cssRules[0].selectorText)
        .toEqual(colours.mapper.selectorTexts[id]);
      colours.destroy();
    });

    it ('should remove the rule', function () {
      colours.initialize();
      const id = 'pv_1';
      expect(colours.mapper.element.sheet.cssRules).toHaveLength(0);
      colours.addRule(id, 'group', '#ccc');
      expect(colours.mapper.element.sheet.cssRules).toHaveLength(1);
      colours.removeRule(id);
      expect(colours.mapper.element.sheet.cssRules).toHaveLength(0);
      colours.destroy();
    });

    it ('should not duplicate rules for same itemId', function () {
      colours.initialize();
      const id = 'pv_1';
      colours.addRule(id, 'group', '#ccc');
      colours.addRule(id, 'group', '#ddd');
      expect(colours.mapper.element.sheet.cssRules).toHaveLength(1);
      colours.destroy();
    });
  });

});
