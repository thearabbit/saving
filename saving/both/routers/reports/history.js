Router.route('saving/historyReport', function () {
    this.render('saving_historyReport');
}, {
    name: 'saving.historyReport',
    header: {title: 'History Report', sub: '', icon: 'file-text-o'},
    title: "History Report"
});

Router.route('saving/historyReportGen', function () {
    // Config layout
    this.layout('reportLayout', {
        // Page size: a4, a5, mini | Orientation: portrait, landscape
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });

    var q = this.params.query;
    this.render('saving_historyReportGen', {
        data: function () {
            return q;
        }
    });
});
