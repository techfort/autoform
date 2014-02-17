var fs = require('fs');

function autoform(view, formDescriptor, engine) {
  var interpolation = {
      start: '[[',
      end: ']]'
    },
    async = false,
    engineName,
    ng,
    descriptor = formDescriptor,
    replacer = {
      jade: {
        input: function (obj) {
          var options,
            output = 'input(',
            property,
            attrs = '',
            parsed;
          options = obj;
          delete options.element;

          for (property in options) {
            if (options[property].substring(0,2) === '@@') {
              parsed = options[property].substring(2, options[property].length);
              attrs += ',' + property + '="#{' + parsed + '}"'; 
            } else {
              attrs += ',' + property + '="' + options[property] + '"';  
            }
          }
          attrs = attrs.substring(1);
          output += attrs + ')';
          
          return output;
        }
      },
      ejs: {
        input: function (obj) {
          var output = ('<' + obj.element + ' '), property, parsed;
          for (property in obj) {
            if (obj[property].substring(0,2) === '@@') {
              parsed = obj[property].substring(2, obj[property].length);
              console.log(parsed);
              output += ' ' + property + '="<%= ' + parsed + ' %>"'; 
            } else {
              output += property + '="' + obj[property] + '" ';
            }
          }
          return output;
        }
      }
    },
    toBeReplaced = function (identifier) {
      return interpolation.start + identifier + interpolation.end;
    };

  engineName = engine || 'jade';
  ng = require(engineName);

  return {
    setAsync: function (bool) {
      async = bool;
    },
    setInterpolate: function (start, end) {
      interpolation.start = start;
      interpolation.end = end;
    },
    process: function () {
      var file = fs.readFileSync(view, 'utf8'),
        prop,
        compiled;
      for (prop in formDescriptor) {
        file = file.replace(toBeReplaced(prop), replacer[engineName][formDescriptor[prop].element](formDescriptor[prop]));
      }
      console.log(file);
      compiled = ng.compile(file);
      return compiled;
    }
  };
}

module.exports = autoform;