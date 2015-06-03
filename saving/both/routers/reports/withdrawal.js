Router.route('saving/withdrawalReport', function () {
    this.render('saving_withdrawalReport');
}, {
    name: 'saving.withdrawalReport',
    header: {title: 'Withdrawal Report', sub: '', icon: 'file-text-o'},
    title: "Withdrawal Report"
});

Router.route('saving/withdrawalReportGen', function () {
    // Config layout
    this.layout('reportLayout', {
        // Page size: a4, a5, mini | Orientation: portrait, landscape
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });

    var q = this.params.query;
    this.render('saving_withdrawalReportGen', {
        data: function () {
            return q;
        }
    });
});
