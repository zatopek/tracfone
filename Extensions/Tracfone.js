initExtensions("TracFone", function (app) {

    app.registerExtension("loaded", function (ctx, page) {
        // Adds HTML IDs to every page based on refname
        var pageName = ctx.page.pageNavigation.pageReferenceName;
        var pageNameTrim = pageName.replace(/ /g, '-').toLowerCase();
        $('html').attr('id', pageNameTrim);

        if (pageNameTrim.indexOf('gonext') >= 0) {
            page.find('button:contains(Next)').click();
            page.find('button:contains(Next)').hide();
            page.find('button:contains(Back)').hide();
        }

        if (pageNameTrim === 'create-interaction') {
            page.find('button:contains(Next)').hide();
        }
        if (pageNameTrim === 'create-interaction-with-form') {
            page.find('button:contains(Done)').hide();
            page.find('button:contains(Next)').hide();
        }
    });

    app.registerExtension('pageRenderer', function (ctx, page) {
        // Place your extension code here
        return page;
    });
});

