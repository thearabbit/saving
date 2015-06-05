Router.route('saving/depositReport', function () {
    this.render('saving_depositReport');
}, {
    name: 'saving.depositReport',
    header: {title: 'Deposit Report', sub: '', icon: 'file-text-o'},
    title: "Deposit Report"
});

Router.route('saving/depositReportGen', function () {
    // Config layout
    this.layout('reportLayout', {
        // Page size: a4, a5, mini | Orientation: portrait, landscape
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });

    var q = this.params.query;
    this.render('saving_depositReportGen', {
        data: function () {
            return q;
        }
    });
});
