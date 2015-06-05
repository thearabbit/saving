Router.route('saving/product', function () {

    this.render('saving_product');

}, {
    name: 'saving.product',
    header: {title: 'product', sub: '', icon: 'user-plus'},
    title: "Product"
});