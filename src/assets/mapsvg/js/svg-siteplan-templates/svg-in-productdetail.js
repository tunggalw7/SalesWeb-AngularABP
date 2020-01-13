jQuery(document).ready(function() {
    localStorage.removeItem("redirectLinkAfterLoggedIn");
    
    var appconfig, frontendOrigin, backendOrigin;
    var tmpCookie = getCookie("Abp.AuthToken");
    
    /* Start: Get App Config from File (assets/appconfig.json) */
    var startGETappconfig = new Date();
    var startPerformanceSummary = new Date();

    var color_available = 'rgba(22, 160, 133,1.0)';
    var color_launching = 'rgba(186, 157, 95,1.0)';
    var color_rental = '#E8808E';
    var color_reserved = 'rgba(241, 196, 15,1.0)';
    var color_delete_kavlings = '#a9a9a9';
    var color_not_for_sale = '#B4DCED';
    var color_sold = 'rgba(232, 65, 24,1.0)';
    var color_available_hold = '#80E8B1';
    var color_hold_single_unit = '#0080ff';
    var color_pending_available = '#F5CDFA';
    var color_used_unit = '#f58231';
    var color_book_in_process = '#808000';

    var colors_collection = [
        color_available,
        color_launching,
        color_rental,
        color_reserved,
        color_delete_kavlings,
        color_not_for_sale,
        color_sold,
        color_available_hold,
        color_hold_single_unit,
        color_pending_available,
        color_used_unit,
        color_book_in_process
    ];

    $.ajax({
        type: "GET",
        url: "assets/appconfig.json",
        dataType: "json",
        cache: false,
        success: function(appconfig, textStatus, xhr) {
            if (!isEmpty(appconfig)) {
                backendOrigin = appconfig.remoteServiceBaseUrl + "/";
                frontendOrigin = window.location.origin + "/";

                mapSvgInit();

            }
        }
    });
    /* End: Get App Config from File (assets/appconfig.json) */

    function mapSvgInit() {
        console.log("TIME - [1] GET APPCONFIG UNTIL START INIT", daysBetween(startGETappconfig, new Date()));

        var config = {};
        var regions = {};
        var requestDetailUnit = null;

        var cons_projectId, cons_clusterId, cons_clusterName, cons_projectInfoId;
        var location = window.location.pathname;
        if (location.indexOf("project-detail") != -1) {
            
            var projectCluster = JSON.parse(localStorage.getItem("projectCluster"));
            cons_projectId = projectCluster.projectId;
            cons_projectInfoId = projectCluster.projectInfoId;
            
            // cons_clusterId = projectCluster.clusterId;
            // cons_clusterName = projectCluster.clusterName;
            
        }
        else if (location.indexOf("siteplan-detail") != -1) {
            
            var projectCluster = location.split("/");
            cons_projectId = projectCluster[2];
            cons_projectInfoId = projectCluster[3];
            
            // cons_clusterId = projectCluster[5];
            // cons_clusterName = projectCluster[6];
            
        }
        
        /* Start: Request API (Diagramatic/GetListDiagramaticWeb) */
        var startMapSVGInit = new Date();
        var startGETGetListDiagramaticSitePlanWeb = new Date();
        $.ajax({
            url: backendOrigin + 'api/services/app/Diagramatic/GetListDiagramaticSitePlanWeb',
            type: 'GET',
            dataType: 'json',
            contentType: "application/json",
            // headers: {
            //     // "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            //     "Authorization": "Bearer " + accessToken
            // },
            // data: "projectId=" + cons_projectId + "&clusterId=" + cons_clusterId,
            data: "projectInfoId=" + cons_projectInfoId,
            success: function(data, textStatus, xhr) {
                console.log("ALL ", data.result);
                console.log("TIME - [2] GET GetListDiagramaticSitePlanWeb", daysBetween(startGETGetListDiagramaticSitePlanWeb, new Date()));
                var objDiagramatic = data.result[0];
                if (objDiagramatic.sitePlanDir == null) {
                    // $("div.mapsvg-loading")[0].innerHTML = objDiagramatic.message;
                    // $("div.mapsvg-loading").css("display", "initial");
                }

                var splitSiteplanDir = (objDiagramatic.sitePlanDir).split("/");
                var loadSiteplanDir = "",
                    siteplanDir = objDiagramatic.sitePlanDir;

                console.log("Request GET - GetListDiagramaticWeb : ", objDiagramatic);

                /* Start: Creating Regions Data Object */
                // Dynamic Diagramatic Object
                var startMappingRegions = new Date();
                if (objDiagramatic.units.length > 0) {
                    for (var i = 0; i < objDiagramatic.units.length; i++) {
                        var dataUnit = objDiagramatic.units[i];

                        if (dataUnit.svgID != null) {
                            var idRegion = (dataUnit.svgID).replace(/\s+/g, '');

                            regions[idRegion] = Object.assign({
                                id: idRegion,
                                'id_no_spaces': idRegion,
                                fill: colorByUnitStatus(dataUnit.unitStatusCode),
                                title: dataUnit.unitType + " / " + dataUnit.unitCode + "-" + dataUnit.unitNo,
                                isAvailable: dataUnit.unitStatusCode == "A" ? true : false,
                                attr: { "cursor": dataUnit.unitStatusCode == "A" ? "pointer" : "default" },
                                data: dataUnit
                            });

                        }

                    }
                }
                console.log("Regions Created ", regions);
                console.log("TIME - [3] Create & Mapping Regions ", daysBetween(startMappingRegions, new Date()));
                /* End: Creating Regions Data Object */

                var startSetConfigMapSVG = new Date();
                config = {

                    /* 
                        (not working properly : URL retrieved from external API)
                        source: "http://10.12.1.42:8095/Assets/Upload/SitePlan/Little_White_House_floor_plan.svg",
                    */

                    source: siteplanDir,
                    // source: "assets/mapsvg/maps/user-uploads/floorplan.svg",

                    /* 
                        (working properly : with local directory)
                        source: "assets/mapsvg/maps/user-uploads/Little_White_House_floor_plan.svg", 
                    */

                    title: splitSiteplanDir[splitSiteplanDir.length - 1],
                    loadingText: 'Waiting for ' + splitSiteplanDir[splitSiteplanDir.length - 1] + ' ...',

                    viewBox: objDiagramatic.viewBox,
                    // viewBox: [0, 0, 273, 274], 
                    // viewBox: [0,0,5826.77,8267.72], // from korey
                    cursor: "pointer",
                    regions: regions,
                    onClick: function(e, m) {
                        // http://103.106.81.48:13001/api/services/app/Diagramatic/GetListDiagramaticWeb?projectId=7&clusterId=8
                        var region = this;
                        var data = region.data;
                        console.log("Region Data OnClick : ", region.data);

                        /* Start: Request API (Diagramatic/GetDetailClusterByUnitIdGet) */
                        $("div.mapsvg-loading")[0].innerHTML = "Trying to get details from " + region.title;
                        $("div.mapsvg-loading").css("display", "initial");

                        $.ajax({
                            url: backendOrigin + 'api/services/app/Diagramatic/GetDetailClusterByUnitId',
                            type: 'GET',
                            dataType: 'json',
                            contentType: "application/json",
                            data: "unitID=" + data.unitID,
                            success: function(dataCluster, textStatus, xhr) {
                                cons_clusterId = dataCluster.result.clusterID;
                                cons_clusterName = dataCluster.result.clusterName;

                                var projectId = cons_projectId;
                                var clusterId = cons_clusterId;
                                var clusterName = cons_clusterName;
                                var unitNo = data.unitNo;
                                var unitCode = data.unitCode;
                                var unitId = data.unitID;
                                var ppNo = false;
                                var psCode = false;

                                var bookingUnitLink = "/booking-unit/" + projectId + "/" + clusterId + "/" + clusterName + "/" + unitNo + "/" + unitCode + "/" + unitId + "/" + ppNo + "/" + psCode;
                                var availableUnitLink = "/app/main/available-unit/" + projectId + "/" + clusterId;
                                var link = bookingUnitLink;

                                console.log("bookingUnitLink : ", bookingUnitLink);
                                console.log("availableUnitLink : ", availableUnitLink);

                                if (!isEmpty(region.data) && region.isAvailable) {
                                    // if (isLoggedIn(tmpCookie)) {
                                        region.mapsvg.zoomTo(region.id);
                                        region.mapsvg.centerOn(region, 50);

                                        // '/app/main/booking-unit', this._form_control.project, this._form_control.tower.split("|")[0], unitNo, codeUnit, unitID,'',''
                                        /* http://103.106.81.52:13003/app/main/booking-unit/:projectID/:clusterid/:unitNo/:unitCode/:unitID/:ppNo/:psCode */
                                        region.mapsvg.unhighlightRegions();
                                        window.open(link, "_self");

                                    // } else {
                                    //     window.open("/account/login", "_self");
                                    //     localStorage.setItem("redirectLinkAfterLoggedIn", link);
                                    // }
                                }
                            },
                            error: function(xhr, textStatus, errorThrown) {
                                console.log('Error in GetListDiagramaticWeb Operation : ', errorThrown);
                            }
                        }).done(function(data) {
                            $("div.mapsvg-loading").fadeOut("slow").css("display", "none");
                        });
                        /* End: Request API (Diagramatic/GetDetailClusterByUnitIdGet) */
                    },
                    mouseOver: function(e, m) {
                        // http://103.106.81.48:13001/api/services/app/Diagramatic/GetDetailDiagramaticWeb?unitID=235
                        var region = this;
                        var flag = localStorage.getItem("")
                        console.log("Region Data OnMouseOver", region);

                        if (!isEmpty(region.data)) {

                            // region.mapsvg.centerOn(region, 50);
                            // region.mapsvg.zoomTo(region, 0.5);

                            $("div.mapsvg-loading")[0].innerHTML = "Waiting for " + region.title;
                            $("div.mapsvg-loading").css("display", "initial");

                            /* Start: Request API (Diagramatic/GetDetailDiagramaticWeb) */
                            // requestDetailUnit = null;
                            requestDetailUnit = $.ajax({
                                url: backendOrigin + 'api/services/app/Diagramatic/GetDetailDiagramaticWeb',
                                type: 'GET',
                                dataType: 'json',
                                contentType: "application/json",
                                // headers: {
                                //     "Authorization": "Bearer " + accessToken
                                // },
                                data: "unitID=" + region.data.unitID,
                                success: function(data, textStatus, xhr) {
                                    console.log("Request GET - GetDetailDiagramaticWeb By UnitID: ", data.result);

                                    /* Start: Set Unit Information & Unit Price */
                                    var dataDetail = data.result.term;
                                    /* End: Set Unit Information & Unit Price */

                                    var termNameText = "";
                                    for (var i = 0; i < dataDetail.length; i++) {
                                        var group = dataDetail[i];

                                        var childText = "";
                                        for (var j = 0; j < group.dataTerm.length; j++) {
                                            var child = group.dataTerm[j];
                                            childText += "<tr>\n \t" +
                                                "<td colspan='2'> &nbsp;&nbsp;" + child.renovName + " </td>\n" +
                                                "<td colspan='2' style=\"text-align:right\">" + currencyFormattedNumber(child.listPrice) + "</td>\n </tr>\n";
                                                // "<td colspan='2' style=\"text-align:right\">" + currencyFormattedNumber(Math.round(child.listPrice)) + "</td>\n </tr>\n";
                                        }

                                        termNameText += ("<tr>\n <th colspan='4'> " + group.termName + " </th>\n </tr>\n" + childText);
                                    }

                                    if (localStorage.getItem("Hover") == 'false') {
                                        /* Start: Set Tooltip for Hovered Region */
                                        region.setTooltip("" +
                                            "<!DOCTYPE html>\n" +
                                            "<html class='tooltip custom'>\n" +
    
                                            "<head>\n\n" +
                                            "<style>" +
                                            "\nhtml {" +
                                            "\npadding: 0;" +
                                            "\nmargin: 0;" +
                                            "\n" +
                                            "}" +
    
                                            "\ntable {" +
                                            "\n font-family: \"Trebuchet MS\";\n  border-collapse: collapse;\n  width: 100%;\n}\n\ntd, th {\n  border: 0;\n  text-align: left;\n  padding: 8px;\n  font-size: 11px;\n}\nth {\n\tfont-weight: bold !important;\n    background-color:" + (region.fill == "#FFFFFF" ? "rgba(236, 240, 241,1.0)" : region.hover_attr.fill) + ";\n}\n\n/*tr:nth-child(even) {background: #CCC}*/\n\n" +
                                            "</style>\n</head>\n" +
    
                                            "<body>\n" +
                                            "<table>\n" +
                                            "<tr>\n" +
                                            "<th colspan='4' style=\"background-color:" + (region.fill == "#FFFFFF" ? "rgba(149, 165, 166,1.0)" : region.fill) + ";color:white;font-size:16px\">Unit Information</th>\n </tr>\n" +
    
                                            "<tr>\n \t" +
                                            "<th>Unit Code</th>\n" +
                                            "<td>" + data.result.unitCode + "</td>\n" +
                                            "<th>Unit No</th>\n" +
                                            "<td>" + data.result.unitNo + "</td>\n </tr>\n" +
                                            "<tr>\n \t" +
                                            "<th>Unit Status</th>\n" +
                                            "<td>" + data.result.unitStatus + "</td>\n" +
                                            "<th>Bedroom</th>\n" +
                                            "<td>" + data.result.bedroom + "</td>\n" +
                                            "<tr>\n" +
                                            "<tr>\n \t" +
                                            "<th>Build Size</th>\n" +
                                            "<td>" + data.result.buildSize + "</td>\n" +
                                            "<th>Land Size</th>\n" +
                                            "<td>" + data.result.landSize + "</td>\n" +
                                            "<tr>\n" +
                                            "<tr>\n \t" +
                                            "<th>Price m<sup>2</sup> build</th>\n" +
                                            // "<td>" + currencyFormattedNumber(parseFloat(data.result.pricePerBuildArea).toFixed(2)) + "</td>\n" +
                                            "<td>" + currencyFormattedNumber(data.result.pricePerBuildArea) + "</td>\n" +
                                            "<th>Price m<sup>2</sup> land</th>\n" +
                                            // "<td>" + currencyFormattedNumber(parseFloat(data.result.pricePerLandArea).toFixed(2)) + "</td>\n" +
                                            "<td>" + currencyFormattedNumber(data.result.pricePerLandArea) + "</td>\n" +
                                            "<tr>\n \n" + 
                                            "<tr>\n" +
                                            "<th colspan='4' style=\"background-color:" + (region.fill == "#FFFFFF" ? "rgba(149, 165, 166,1.0)" : region.fill) + ";color:white;font-size:16px\">Unit Price<br><span style=\"font-size:13px;margin-top:0 !important;\">(TermTerm Of Payment)</span> </th>\n </tr>\n" +
                                            termNameText +
                                            "</table>\n\n" +
                                            "<p style=\"color:red;font-weight:bold;font-size:12px\">* Price Exclude VAT (PPN)</p>\n" +
    
                                            "</body>\n" +
    
                                            "</html>"
                                        );
                                        /* End: Set Tooltip for Hovered Region */
                                    } if (localStorage.getItem("Hover") == 'true') {
                                        /* Start: Set Tooltip for Hovered Region */
                                        region.setTooltip("" +
                                            "<!DOCTYPE html>\n" +
                                            "<html class='tooltip custom'>\n" +
    
                                            "<head>\n\n" +
                                            "<style>" +
                                            "\nhtml {" +
                                            "\npadding: 0;" +
                                            "\nmargin: 0;" +
                                            "\n" +
                                            "}" +
    
                                            "\ntable {" +
                                            "\n font-family: \"Trebuchet MS\";\n  border-collapse: collapse;\n  width: 100%;\n}\n\ntd, th {\n  border: 0;\n  text-align: left;\n  padding: 8px;\n  font-size: 11px;\n}\nth {\n\tfont-weight: bold !important;\n    background-color:" + (region.fill == "#FFFFFF" ? "rgba(236, 240, 241,1.0)" : region.hover_attr.fill) + ";\n}\n\n/*tr:nth-child(even) {background: #CCC}*/\n\n" +
                                            "</style>\n</head>\n" +
    
                                            "<body>\n" +
                                            "<table>\n" +
                                            "<tr>\n" +
                                            "<th colspan='4' style=\"background-color:" + (region.fill == "#FFFFFF" ? "rgba(149, 165, 166,1.0)" : region.fill) + ";color:white;font-size:16px\">Unit Information</th>\n </tr>\n" +
    
                                            "<tr>\n \t" +
                                            "<th>Unit Code</th>\n" +
                                            "<td>" + data.result.unitCode + "</td>\n" +
                                            "<th>Unit No</th>\n" +
                                            "<td>" + data.result.unitNo + "</td>\n </tr>\n" +
                                            "<tr>\n \t" +
                                            "<th>Unit Status</th>\n" +
                                            "<td>" + data.result.unitStatus + "</td>\n" +
                                            "<th>Bedroom</th>\n" +
                                            "<td>" + data.result.bedroom + "</td>\n" +
                                            "<tr>\n" +
                                            "<tr>\n \t" +
                                            "<th>Build Size</th>\n" +
                                            "<td>" + data.result.buildSize + "</td>\n" +
                                            "<th>Land Size</th>\n" +
                                            "<td>" + data.result.landSize + "</td>\n" +
                                            "<tr>\n" +
                                            "<tr>\n \t" +
                                            "<th>Price m<sup>2</sup> build</th>\n" +
                                            // "<td>" + currencyFormattedNumber(parseFloat(data.result.pricePerBuildArea).toFixed(2)) + "</td>\n" +
                                            "<td>" + currencyFormattedNumber(data.result.pricePerBuildArea) + "</td>\n" +
                                            "<th>Price m<sup>2</sup> land</th>\n" +
                                            // "<td>" + currencyFormattedNumber(parseFloat(data.result.pricePerLandArea).toFixed(2)) + "</td>\n" +
                                            "<td>" + currencyFormattedNumber(data.result.pricePerLandArea) + "</td>\n" +
                                            "<tr>\n \n" + 
                                            "<tr>\n" +
                                            "<th colspan='4' style=\"background-color:" + (region.fill == "#FFFFFF" ? "rgba(149, 165, 166,1.0)" : region.fill) + ";color:white;font-size:16px\">Unit Price<br><span style=\"font-size:13px;margin-top:0 !important;\">(TermTerm Of Payment)</span> </th>\n </tr>\n" +
                                            termNameText +
                                            "</table>\n\n" +
                                            "<p style=\"color:red;font-weight:bold;font-size:12px\">* Price Include VAT (PPN)</p>\n" +
    
                                            "</body>\n" +
    
                                            "</html>"
                                        );
                                        /* End: Set Tooltip for Hovered Region */
                                    }

                                    setTimeout(function() {
                                        region.mapsvg.showTooltip(region);
                                    }, 0);
                                },
                                error: function(xhr, textStatus, errorThrown) {
                                    console.log('Error in GetDetailDiagramaticWeb Operation : ', errorThrown);
                                }
                            }).done(function(data) {
                                $("div.mapsvg-loading").fadeOut("slow").css("display", "none");
                            });
                            /* End: Request API (Diagramatic/GetDetailDiagramaticWeb) */

                        } else {
                            region.mapsvg.zoomOut();
                            // region.mapsvg.viewBoxReset();
                            region.setTooltip("No Data")
                        }
                    },
                    mouseOut: function(e, m) {
                        this.mapsvg.zoomOut();
                        $(".mapsvg-tooltip").removeClass("mapsvg-tooltip-visible");

                        if (requestDetailUnit.readyState == 1) {
                            if (requestDetailUnit.abort()) {
                                $("div.mapsvg-loading").css("display", "initial");
                                $("div.mapsvg-loading")[0].innerHTML = "Aborting Request for " + this.title;
                                setTimeout(function() {
                                    $("div.mapsvg-loading").css("display", "none");
                                }, 500);
                            }
                        }
                    },
                    zoom: {
                        on: true,
                        limit: [0, 10],
                        delta: 2,
                        buttons: {
                            on: true,
                            location: "right"
                        },
                        mousewheel: true
                    },
                    scroll: {
                        on: true,
                        limit: false,
                        background: false,
                        spacebar: false
                    },
                    tooltips: {
                        mode: "combined",
                        on: false,
                        priority: "local",
                        position: "right"
                    },
                    // popovers: {
                    //     mode: "off",
                    //     on: false,
                    //     priority: "local",
                    //     position: "top",
                    //     centerOn: true,
                    //     width: 300,
                    //     maxWidth: 50,
                    //     maxHeight: 50,
                    //     resetViewboxOnClose: true,
                    //     mobileFullscreen: true
                    // },
                    // gauge: {
                    //     on: false,
                    //     labels: { low: "low", high: "high" },
                    //     colors: {
                    //         lowRGB: { r: 85, g: 0, b: 0, a: 1 },
                    //         highRGB: { r: 238, g: 0, b: 0, a: 1 },
                    //         low: "#550000",
                    //         high: "#ee0000",
                    //         diffRGB: { r: 153, g: 0, b: 0, a: 0 }
                    //     },
                    //     min: 0,
                    //     max: false
                    // },
                    menu: {
                        on: true,
                        search: true,
                        searchPlaceholder: "Search ...",
                        sortBy: 'fill',
                        sortDirection: 'desc',
                        containerId: "mapsvg-menu-regions",
                        template: function(region) {
                            if (colors_collection.indexOf(region.fill) != -1) {
                                return '<a href="#' + region.id + '"> ' + region.title + ' </a>';
                            }
                        }
                    },
                    responsive: true,
                    pan: true,
                    filters: { on: true }
                };
                console.log("TIME - [4] SET CONFIG MAPSVG ", daysBetween(startSetConfigMapSVG, new Date()));

                setTimeout(function() {
                    var startInit = new Date();
                    $("#mapsvg").mapSvg(config);
                    console.log("TIME - [5] CONFIG INIT ", daysBetween(startInit, new Date()));

                    console.log("TIME - [6] MAPSVG INIT PERFORMANCE SUMMARY ", daysBetween(startMapSVGInit, new Date()));
                    console.log("TIME - [7] ALL PERFORMANCE SUMMARY ", daysBetween(startPerformanceSummary, new Date()));
                }, 0);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log('Error in GetListDiagramaticWeb Operation : ', errorThrown);
            }
        });
        /* End: Request API (Diagramatic/GetListDiagramaticWeb) */
    }

    function colorByUnitStatus(status) {
        switch (status) {
            case 'L':
                return color_launching;
            case 'A':
                return color_available;
            case 'Z':
                return color_reserved;
            case 'S':
                return color_sold;
        }
    }

    function isLoggedIn(accessToken) {
        if (accessToken != "")
            return true;
        else
            return false;

    }
});