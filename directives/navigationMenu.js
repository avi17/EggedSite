
mslApp.directive('navigationMenu', function () {
    return {
        scope: true,
        templateUrl: '/app/views/directive/navigationMenu.html',
        link: function (scope, element, attrs) {

            scope.isPopupVisible = false;

            scope.menuButtonClicked = function () {
                scope.isPopupVisible = !scope.isPopupVisible;
            }

            scope.itemList = [];
            scope.itemList.push(
                {
                    categoryName: "סוגי חיפוש", itemList: [
                    { id: 2, name: "Bydest", text: "מוצא ויעד", url: "http://mslworld.egged.co.il/?state=1" },
                    { id: 3, name: "Byline", text: "מספר קו", url: "http://mslworld.egged.co.il/?state=2" },
                    { id: 4, name: "Byfreetext", text: "טקסט חופשי", url: "http://tnuawebtst:91/app/index.html#/freetextquery" },
                    { id: 1, name: "Realtime", text: "זמן אמת", url: "http://mslworld.egged.co.il/?state=3" },
                    ]
                });
            scope.itemList.push(
                {
                    categoryName: "שירותי משתמש", itemList: [
                    { id: 5, name: "Sitemessages", text: "הודעות אתר", url: "http://mslworld.egged.co.il" },
                    { id: 6, name: "Previousversion", text: "לאתר בגירסה הקודמת", url: "http://91.223.11.23/eggedtimetable/WebForms/wfrmMain.aspx" },
                    { id: 7, name: "Faq", text: "שאלות נפוצות", url: "http://mslworld.egged.co.il/#/faq" },
                    { id: 8, name: "Contactus", text: "צור קשר", url: "http://www.egged.co.il/%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8.aspx" }
                    ]
                });

            scope.elementFocused = function (e) {
                //scope.isPopupVisible = true;
            }

            scope.elementBlured = function (e) {
                //scope.isPopupVisible = false;
            }



        }
    }
});