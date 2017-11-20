$(function () {

    //Autor
    function myAutor() {

        document.querySelector("span").innerHTML = "Autor: Karolina Wróblewska";

    }
    myAutor();

    function printFail(message = "Fail") {

        $('.alert')
            .removeClass('alert-success')
            .addClass('alert-danger')
            .html(message);
        setTimeout(function () {
            $('.alert').removeClass('alert-danger').html("");
        }, 2000);
    }

    function formToInsertMode() {
        $('form button[data-action=add]').show();
        $('form button[data-action=edit]').hide()[0].dataset.id = "";
        $('form button[data-action=cancel]').hide();
        $('form')[0].reset();

        event.preventDefault();
    }

    // Show list of books

    function updateBookList() {
        $.getJSON('http://localhost:50855/api/books').done(function (data) {
            $('.table-books>tbody').html("");
            data.forEach(function (book) {
                console.log(data);
                // $('.table-books>tbody').append('<tr><td>'+book.Title+'</td><td>'+book.Author+'</td><td><div class="button-group"><button class="btn btn-primary btn-sm">Edytuj</button><button class="btn btn-danger btn-sm">Usuń</button><button class="btn btn-info btn-sm">Wypożycz</button></div></td></tr>');
                $('.table-books>tbody').append(`
                <tr>
                    <td>${book.Title}</td>
                    <td>${book.Author}</td>
                    <td>
                    <div data-id="${book.ID}" class="button-group">
                        <button class="btn btn-primary btn-sm">Edytuj</button>
                        <button class="btn btn-danger btn-sm">Usuń</button>
                        <button class="btn btn-info btn-sm">Wypożycz</button>
                    </div>
                    </td>
                </tr>`
                );
            });
        }).fail(function (xml, status, err) {
            console.log(xml, status, err);
            printFail();
        });

    }

    updateBookList();

    // Remove list of books

    $('.table-books>tbody').on('click', 'button.btn-danger', function (event) {
        $.ajax({
            url: 'http://localhost:50855/api/books/'
            + $(event.target).parent().data('id'),
            type: 'DELETE'
        }).done(function () {
            $(event.target).closest('tr').remove();
        }).fail(function (xml, status, err) {
            console.log(xml, status, err);
            printFail();
        })
    });

    // Add new Book

    $('form.form-book').on('submit', function (event) {
        // console.log(event.target.dataset.action);
        // console.log(document.activeElement);
        // return false;


        if (document.activeElement.dataset.action === "cancel") {
            // do nothing
            console.log("cancel");
        } else {
            // validation
            if (this.author.value.trim().length === 0
                || this.title.value.trim().length === 0) {
                printFail("Use mor descriptive description :)")
            } else { // if form is valid and button is not cancel
                if (document.activeElement.dataset.action === "add") {
                    console.log("add");
                    $.ajax({
                        url: 'http://localhost:50855/api/books',
                        type: 'POST',
                        headers: {
                            Author: this.author.value,
                            Title: this.title.value
                        }
                    }).done(function () {
                        updateBookList();
                    }).fail(function (xml, status, err) {
                        console.log(xml, status, err);
                        printFail();
                    });
                } else if (document.activeElement.dataset.action === "edit") {
                    console.log("edit");
                    var id = $('form button[data-action=edit]').data('id');
                    event.preventDefault();
                    // return;

                    $.ajax({
                        url: 'http://localhost:50855/api/books/' + id,
                        type: 'PUT',
                        headers: {
                            Author: this.author.value,
                            Title: this.title.value
                        }
                    }).done(function () {
                        updateBookList();
                        formToInsertMode();
                    }).fail(function (xml, status, err) {
                        console.log(xml, status, err);
                        printFail();
                    });
                }
            }
        }

        this.reset();
        event.preventDefault();
        return false;

    });

    // Change mode of form form inserting to editing

    $('.table-books>tbody').on('click', 'button.btn-primary', function (event) {

        var id = $(event.target).parent().data('id');
        var title = $(event.target).closest('tr').children('td').eq(0).text();
        var author = $(event.target).closest('tr').children('td').eq(1).text();

        console.log(id);
        console.log(title);
        console.log(author);
        $('form button[data-action=add]').hide();
        $('form button[data-action=edit]').show()[0].dataset.id = id;
        $('form button[data-action=cancel]').show();
        $('form')[0].author.value = author;
        $('form')[0].title.value = title;

        event.preventDefault();
    });



    // Possibility of come back to inserting mode

    $('form button[data-action=cancel]').on('click', function (event) {

        formToInsertMode();
    });

    // Show list of readers

    function updateReadersList() {
        $.getJSON('http://localhost:50855/api/readers').done(function (data) {
            $('.table-readers>tbody').html("");
            data.forEach(function (reader) {
                console.log(data);
                // $('.table-books>tbody').append('<tr><td>'+book.Title+'</td><td>'+book.Author+'</td><td><div class="button-group"><button class="btn btn-primary btn-sm">Edytuj</button><button class="btn btn-danger btn-sm">Usuń</button><button class="btn btn-info btn-sm">Wypożycz</button></div></td></tr>');
                $('.table-readers>tbody').append(`
                <tr>
                    <td>${reader.Name}</td>
                    <td>${reader.Age}</td>
                    <td>
                    <div data-id="${reader.ID}" class="button-group">
                        <button class="btn btn-primary btn-sm">Edytuj</button>
                        <button class="btn btn-danger btn-sm">Usuń</button>
                        <button class="btn btn-info btn-sm">Wybierz</button>
                    </div>
                    </td>
                </tr>`
                );
            });
        }).fail(function (xml, status, err) {
            console.log(xml, status, err);
            printFail();
        });

    }

    updateReadersList();

    // Remove reader from list

    $('.table-readers>tbody').on('click', 'button.btn-danger', function (event) {
        $.ajax({
            url: 'http://localhost:50855/api/readers/'
            + $(event.target).parent().data('id'),
            type: 'DELETE'
        }).done(function () {
            $(event.target).closest('tr').remove();
        }).fail(function (xml, status, err) {
            console.log(xml, status, err);
            printFail();
        })
    });

    // Add new Reader

    $('form.form-readers').on('submit', function (event) {

        if (document.activeElement.dataset.action === "cancel-reader") {
            // do nothing
            console.log("cancel-reader");
        } else {
            // validation
            if (this.name.value.trim().length === 0
                || this.age.value.trim().length === 0) {
                printFail("Use mor descriptive description :)")
            } else { // if form is valid and button is not cancel
                if (document.activeElement.dataset.action === "add-reader") {
                    console.log("add-reader");
                    $.ajax({
                        url: 'http://localhost:50855/api/readers',
                        type: 'POST',
                        headers: {
                            Name: this.name.value,
                            Age: this.age.value
                        }
                    }).done(function () {
                        updateReadersList();
                    }).fail(function (xml, status, err) {
                        console.log(xml, status, err);
                        printFail();
                    });
                } else if (document.activeElement.dataset.action === "edit-reader") {
                    console.log("edit-reader");
                    var id = $('form button[data-action=edit-reader]').data('id');
                    event.preventDefault();
                    // return;

                    $.ajax({
                        url: 'http://localhost:50855/api/readers/' + id,
                        type: 'PUT',
                        headers: {
                            Name: this.name.value,
                            Age: this.age.value
                        }
                    }).done(function () {
                        updateReadersList();
                        formToInsertModeReader();
                    }).fail(function (xml, status, err) {
                        console.log(xml, status, err);
                        printFail();
                    });
                }
            }
        }

        this.reset();
        event.preventDefault();
        return false;

    });


    // Change mode of form form inserting to editing

    $('.table-readers>tbody').on('click', 'button.btn-primary-readers', function (event) {

        var id = $(event.target).parent().data('id');
        var name = $(event.target).closest('tr').children('td').eq(0).text();
        var age = $(event.target).closest('tr').children('td').eq(1).text();

        console.log(id);
        console.log(name);
        console.log(age);
        $('form button[data-action=add-reader]').hide();
        $('form button[data-action=edit-reader]').show()[0].dataset.id = id;
        $('form button[data-action=cancel-reader]').show();
        $('form.form-readers')[0].name.value = name;
        $('form.form-readers')[0].age.value = age;

        event.preventDefault();
    });

    function formToInsertModeReader() {
        $('form button[data-action=add-reader]').show();
        $('form button[data-action=edit-reader]').hide()[0].dataset.id = "";
        $('form button[data-action=cancel-reader]').hide();
        $('form.form-readers')[0].reset();

        event.preventDefault();
    }

    // Possibility of come back to inserting mode

    $('form button[data-action=cancel-reader]').on('click', function (event) {

        formToInsertModeReader();
    });


    // Show list of lends

    function updateLendList() {
        $.getJSON('http://localhost:50855/api/lend').done(function (data) {
            $('.table-lend>tbody').html("");
            data.forEach(function (lend) {
                console.log(data);
                // $('.table-books>tbody').append('<tr><td>'+book.Title+'</td><td>'+book.Author+'</td><td><div class="button-group"><button class="btn btn-primary btn-sm">Edytuj</button><button class="btn btn-danger btn-sm">Usuń</button><button class="btn btn-info btn-sm">Wypożycz</button></div></td></tr>');
                $('.table-lend>tbody').append(`
                <tr>
                    <td>${lend.Title}</td>
                    <td>${lend.Name}</td>
                    <td>${lend.LendDate}</td>
                    <td>
                    <div data-id="${lend.ID}" class="button-group">
                        <button class="btn btn-danger btn-sm">Oddano</button>
                    </div>
                    </td>
                </tr>`
                );
            });
        }).fail(function (xml, status, err) {
            console.log(xml, status, err);
            printFail();
        });

    }

    updateLendList();

    // Remove lend from list

    $('.table-lend>tbody').on('click', 'button.btn-danger', function (event) {
        $.ajax({
            url: 'http://localhost:50855/api/lend/'
            + $(event.target).parent().data('id'),
            type: 'DELETE'
        }).done(function () {
            $(event.target).closest('tr').remove();
        }).fail(function (xml, status, err) {
            console.log(xml, status, err);
            printFail();
        })
    });

    // Add new lend




    $('.table-books>tbody').on('click', 'button.btn-info', function (event) {
        printFail("Wybierz czytelnika");
        $('.table-readers>tbody').on('click', 'button.btn-info', function (event) {

                console.log("add-lend");
                $.ajax({
                    url: 'http://localhost:50855/api/lend',
                    type: 'POST',
                    headers: {
                        BookID: this.bookID,
                        ReaderID: this.readerID,
                        LendDate: this.lendDate
                    }
                }).done(function () {
                    updateLendList();
                }).fail(function (xml, status, err) {
                    console.log(xml, status, err);
                    printFail();
                });
                printFail("Książka została wypożyczona");

        });
        event.preventDefault();
    });


    //$('form.form-lend').on('submit', function (event) {

      

    //    else { // if form is valid and button is not cancel
    //        if(document.activeElement.dataset.action === "add-lend") {
    //            console.log("add-lend");
    //            $.ajax({
    //                url: 'http://localhost:50855/api/lend',
    //                type: 'POST',
    //                headers: {
    //                    Name: this.name.value,
    //                    Age: this.age.value
    //                }
    //            }).done(function () {
    //                updateReadersList();
    //            }).fail(function (xml, status, err) {
    //                console.log(xml, status, err);
    //                printFail();
    //            });
    //        } else if (document.activeElement.dataset.action === "edit-reader") {
    //            console.log("edit-reader");
    //            var id = $('form button[data-action=edit-reader]').data('id');
    //            event.preventDefault();
    //            // return;

    //            $.ajax({
    //                url: 'http://localhost:50855/api/readers/' + id,
    //                type: 'PUT',
    //                headers: {
    //                    Name: this.name.value,
    //                    Age: this.age.value
    //                }
    //            }).done(function () {
    //                updateReadersList();
    //                formToInsertModeReader();
    //            }).fail(function (xml, status, err) {
    //                console.log(xml, status, err);
    //                printFail();
    //            });
    //        }
           

    //    this.reset();
    //    event.preventDefault();
    //    return false;

    //});


});