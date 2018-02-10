'use strict';

class FormSlicer{
    /* 
    * Recieves an object cotaining the configs: form is the selector to the form using
    * formslicer, next is the value of button responsible to get the next input and prev is 
    * the button to go to the previous input.
    */
    constructor(config = {form: '#fslicer', next: 'next', prev: 'previous'}){
        this.form = config.form ? config.form : '#fslicer';
        this.next_button = config.next ? config.next : 'next';
        this.prev_button = config.prev ? config.prev : 'previous';
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
                        that.next(false);
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
        const fieldsets_selector = this.form + ' fieldset';
        const fieldsets = document.querySelectorAll(fieldsets_selector);
        const that = this;
        const fieldset_arr = Array.from(fieldsets)
            .forEach(element => {
                let prev = document.createElement('button');
                prev.classList.add('prev', 'bgt');
                prev.textContent = that.prev_button;
                prev.type = 'button';

                let next = document.createElement('button');
                next.classList.add('next', 'bgt')
                next.textContent = that.next_button;
                next.type = 'button';

                if (element.previousElementSibling && element.nextElementSibling) {
                    element.appendChild(prev);
                    element.appendChild(next);
                } else if (element.nextElementSibling) {
                    next.classList.add('currentNext');
                    element.appendChild(next);
                } else if (element.previousElementSibling) {
                    element.appendChild(prev);
                }
            });
    }

    /** 
    * Recognizes the first "next" button, sets the fieldset (parent) as none
    * and gets the next fieldset sibling adding block property
    * 
    * If the last element of the next fieldset is also a button that has the "next" class
    * it adds the class "currentNext" on it.
    * If it doesn't have a button before (prev) it adds class "currentPrev"
    * If there is not any other "next" it adds the class "currentPrev"
    * 
    */
    next(validate = false){
        let current_button = document.getElementsByClassName('currentNext')[0];
        
        // Uses the validate function to check the inputs and release the button
        // if (validate) {
        //     if (!this.validar()) {
        //         return;
        //     }
        // }
        current_button.parentElement.style.display = 'none';
        current_button.parentElement.nextElementSibling.style.display = 'block';
        if (this.lastChildNextParent(current_button).classList.contains('next')) {
            this.lastChildNextParent(current_button).previousElementSibling.classList.add('currentPrev');
            this.lastChildNextParent(current_button).classList.add('currentNext');
        } else {
            this.lastChildNextParent(current_button).classList.add('currentPrev');
        }
        current_button.parentNode.lastChild.previousElementSibling.classList.remove('currentPrev');
        current_button.classList.remove('currentNext');
    }

    /** not: 
    * Recognizes the first button currentPrev, sets the fieldset(parent) as display:none 
    * gets the next fieldset sibling of the parent and adds block property
    * 
    * At the if statement it gets the parent then gets the last element equals to the parent 
    * before it, searches the last child, gets the last sibling and check if it is next or prev
    * the big deal here is to keep the currentNext and when the previous is done
    * but it is solved at the else statment that checks if it has a sibling to the last child
    * 
    */
    prev(){
        // Previous
        let current_button = document.getElementsByClassName('currentPrev')[0];
        current_button.parentElement.style.display = 'none';
        current_button.parentElement.previousElementSibling.style.display = 'block';
        if (this.lastChildPreviousParent(current_button).previousElementSibling.classList.contains('prev')) {

            this.lastChildPreviousParent(current_button)
                .previousElementSibling.classList
                .add('currentPrev');
            this.lastChildPreviousParent(current_button).classList.add('currentNext');

        } else {
            this.lastChildPreviousParent(current_button).classList.add('currentNext');
        }
        current_button.parentNode.lastChild.previousElementSibling.classList.remove('currentPrev');
        current_button.classList.remove('currentNext');
    }

    lastChildNextParent(current_button){
        return current_button.parentNode.nextElementSibling.lastChild;
    }

    lastChildPreviousParent(current_button){
        return current_button.parentNode.previousElementSibling.lastChild;
    }

}

let fs = new FormSlicer();
