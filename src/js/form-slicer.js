'use strict';

class FormSlicer{
    /* 
    * Recieves an object cotaining the configs: form is the selector to the form using
    * formslicer, next is the value of button responsible to get the next input and prev is 
    * the button to go to the previous input.
    */
    constructor(config = {form: '#fslicer', next: 'next', prev: 'previous'}){
        this.form = config.form ? config.form : '#fslicer';
        this.next = config.next ? config.next : 'next';
        this.prev = config.prev ? config.prev : 'previous';
        this.generate();
    }

    /*
    * Hides every fieldsets but the first
    * Add event listener to next and previous
    */
    generate(){
        const fslicer = document.querySelectorAll(this.form);
        if (fslicer.length > 0){
            const fieldsets_selector = this.form + ' fieldset:not(:first-of-type)';
            const fieldsets = document.querySelectorAll(fieldsets_selector);
            const fieldsetsArr = Array.from(fieldsets);
            fieldsetsArr.forEach(x => {
                x.style.display = 'none';
            });
            this.createButtons();
        }

        const that = this;
        const forms = document.querySelectorAll('form');
        const forms_arr = Array.from(forms);
        forms_arr.forEach((element) => {
            element.addEventListener('click', function(e){
                if (e.target && e.target.matches('.currentNext')){
                    if (this.classList.contains('fs-validate')) {
                        that.next(true);
                    } else {
                        that.next();
                    }
                } else if (e.target && e.target.matches('.currentPrev')){
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
    createButtons(){
        const fieldsets_selector = this.form + 'fieldset';
        const fieldsets = document.querySelectorAll(fieldsets_selector);
        const fieldset_arr = Array.from(fieldsets)
            .forEach(element => {
                let prev = document.createElement('button');
                prev.classList.add('prev', 'bgt');
                prev.textContent = 'previous';
                prev.type = 'button';

                let next = document.createElement('button');
                next.classList.add('next', 'bgt')
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

    next(validate){
        let current_button = document.getElementsByClassName('currentNext')[0];
        
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

    prev(){
        // Previous
        let current_button = document.getElementsByClassName('atualPrev')[0];
        current_button.parentElement.style.display = 'none';
        current_button.parentElement.previousElementSibling.style.display = 'block';
        if (this.lastChildPreviousParent(current_button).previousElementSibling.classList.contains('prev')) {

            this.lastChildPreviousParent(current_button)
                .previousElementSibling.classList
                .add('atualPrev');
            this.lastChildPreviousParent(current_button).classList.add('currentNext');

        } else {
            this.lastChildPreviousParent(current_button).classList.add('currentNext');
        }
        current_button.parentNode.lastChild.previousElementSibling.classList.remove('currentPrev');
        current_button.classList.remove('currentNext');
    }

    lastChildNextParent(current_button){
        return botaoAtual.parentNode.nextElementSibling.lastChild;
    }

    lastChildPreviousParent(current_button){
        return current_button.parentNode.previousElementSibling.lastChild;
    }

}

let fs = new FormSlicer();
