'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormSlicer = function () {
    /* 
    * Recieves an object cotaining the configs: form is the selector to the form using
    * formslicer, next is the value of button responsible to get the next input and prev is 
    * the button to go to the previous input.
    */
    function FormSlicer() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { form: '#fslicer', next: 'next', prev: 'previous' };

        _classCallCheck(this, FormSlicer);

        this.form = config.form ? config.form : '#fslicer';
        this.next = config.next ? config.next : 'next';
        this.prev = config.prev ? config.prev : 'previous';
        this.generate();
    }

    /*
    * Hides every fieldsets but the first
    * Add event listener to next and previous
    */


    _createClass(FormSlicer, [{
        key: 'generate',
        value: function generate() {
            var fslicer = document.querySelectorAll(this.form);
            if (fslicer.length > 0) {
                var fieldsets_selector = this.form + ' fieldset:not(:first-of-type)';
                var fieldsets = document.querySelectorAll(fieldsets_selector);
                var fieldsetsArr = Array.from(fieldsets);
                fieldsetsArr.forEach(function (x) {
                    x.style.display = 'none';
                });
                this.createButtons();
            }

            var that = this;
            var forms = document.querySelectorAll('form');
            var forms_arr = Array.from(forms);
            forms_arr.forEach(function (element) {
                element.addEventListener('click', function (e) {
                    if (e.target && e.target.matches('.currentNext')) {
                        if (this.classList.contains('fs-validate')) {
                            that.next(true);
                        } else {
                            that.next();
                        }
                    } else if (e.target && e.target.matches('.currentPrev')) {
                        that.prev();
                    }
                });
            });
        }
        /*
        * Get the arrays and transform them into an Array then executes the creation
        * of buttons next and previous with their proper classes
        * the first "next" button gets the class currentNext
        */

    }, {
        key: 'createButtons',
        value: function createButtons() {
            var fieldsets_selector = this.form + 'fieldset';
            var fieldsets = document.querySelectorAll(fieldsets_selector);
            var fieldset_arr = Array.from(fieldsets).forEach(function (element) {
                var prev = document.createElement('button');
                prev.classList.add('prev', 'bgt');
                prev.textContent = 'previous';
                prev.type = 'button';

                var next = document.createElement('button');
                next.classList.add('next', 'bgt');
                next.textContent = 'next';
                next.type = 'button';

                if (element.previousElementSibling && element.nextElementSibling) {
                    element.appendChild(prev);
                    element.appendChild(next);
                } else if (element.nextElementSibling) {
                    next.classList.add('atualNext');
                    element.appendChild(next);
                } else if (element.previousElementSibling) {
                    element.appendChild(prev);
                }
            });
        }
    }, {
        key: 'next',
        value: function next(validate) {
            var current_button = document.getElementsByClassName('currentNext')[0];

            // Uses the validate function to check the inputs and release the button
            // if (validate) {
            //     if (!this.validar()) {
            //         return;
            //     }
            // }
            current_button.parentElement.style.display = 'none';
            current_button.parentElement.nextElementSibling.style.display = 'block';
            if (lastChildNextParent(current_button).classList.contains('next')) {
                lastChildNextParent(current_button).previousElementSibling.classList.add('currentPrev');
                lastChildNextParent(current_button).classList.add('currentNext');
            } else {
                lastChildNextParent(current_button).classList.add('currentPrev');
            }
            current_button.parentNode.lastChild.previousElementSibling.classList.remove('currentPrev');
            current_button.classList.remove('currentNext');
        }
    }, {
        key: 'prev',
        value: function prev() {
            // Previous
            var current_button = document.getElementsByClassName('atualPrev')[0];
            current_button.parentElement.style.display = 'none';
            current_button.parentElement.previousElementSibling.style.display = 'block';
            if (this.lastChildPreviousParent(current_button).previousElementSibling.classList.contains('prev')) {

                this.lastChildPreviousParent(current_button).previousElementSibling.classList.add('atualPrev');
                this.lastChildPreviousParent(current_button).classList.add('currentNext');
            } else {
                this.lastChildPreviousParent(current_button).classList.add('currentNext');
            }
            current_button.parentNode.lastChild.previousElementSibling.classList.remove('currentPrev');
            current_button.classList.remove('currentNext');
        }
    }, {
        key: 'lastChildNextParent',
        value: function lastChildNextParent(current_button) {
            return botaoAtual.parentNode.nextElementSibling.lastChild;
        }
    }, {
        key: 'lastChildPreviousParent',
        value: function lastChildPreviousParent(current_button) {
            return current_button.parentNode.previousElementSibling.lastChild;
        }
    }]);

    return FormSlicer;
}();

var fs = new FormSlicer();