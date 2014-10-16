$(document).ready(function() {
    $('button.siteActions').each(function() {
        var data = $(this).data();
        $(this).popover({
            html:true,
            content: function() {
                html = '<ul>';
                html += '<li><a href="' + data.portalUrl + '" target="_blank">View</a></li>';
                html += '<li><a href="' + data.portalUrl + '/plone_control_panel" target="_blank">Control panel</a></li>';
                html += '<li><a href="' + data.portalUrl + '/prefs_install_products_form" target="_blank">Products</a></li>';
                html += '<li><a href="' + data.portalUrl + '/manage" target="_blank">ZMI</a></li>';
                html += '<li><a href="' + data.portalUrl + '/prefs_users_overview" target="_blank">Users and Groups</a></li>';
                html += '<li><a href="' + data.portalUrl + '/@@plone-upgrade" target="_blank">Migration</a></li>';
                html += '</ul>';
                return html;
            }
        });
    });
    $('.tooltipInfo').each(function() {
        $(this).tooltip();
    });
    $('table.table').on('click', 'a.productAction' , function(event){
        event.preventDefault();
        var $this = $(this);
        var old_html = $this.html();
        $this.html( '<i class="fa fa-refresh fa-spin fa-lg"></i>' );
        $.ajax({
            url: this.href,
            dataType: "json",
            success: function(data) {
                var $this_data = $this.data();
                if (data.result === 'ok') {
                    if (data.new_state === 'installed') {
                        $this.attr('class', "productAction label label-danger tooltipInfo");
                        $this.attr('href', $this_data.portalUrl + '/@@handle-products?action=uninstall&product=' + $this_data.productId);
                        $this.attr('title', $this_data.uninstallLabel);
                        $this.html('<i class="fa fa-trash fa-lg"></i></a>');
                        $this.tooltip('destroy');
                        $this.tooltip();
                        // html = '<a class="productAction label label-danger tooltipInfo"';
                        // html +=' href="' + $this_data.portalUrl + '/@@handle-products?action=uninstall&product=' + $this_data.productId + '"';
                        // html += ' data-portal-url="' + $this_data.portalUrl + '"';
                        // html += ' data-product-id="' + $this_data.productId + '"';
                        // html += ' data-uninstall-label="' + $this_data.uninstallLabel + '"';
                        // html += ' data-install-label="' + $this_data.installLabel + '"';
                        // html += ' title="' + $this_data.uninstallLabel + '"';
                        // html += ' ">';
                        // html += '<i class="fa fa-trash fa-lg"></i></a>';
                        // html += '</a>';
                        // $this.html(html);
                    }
                    else if (data.new_state === 'uninstalled') {
                        $this.siblings('.upgrade').remove();
                        $this.attr('class', "productAction label label-primary tooltipInfo");
                        $this.attr('href', $this_data.portalUrl + '/@@handle-products?action=install&product=' + $this_data.productId);
                        $this.attr('title', $this_data.installLabel);
                        $this.html('<i class="fa fa-plus fa-lg"></i></a>');
                        $this.tooltip('destroy');
                        $this.tooltip();
                    }
                    else if (data.new_state === 'updated') {
                        $this.remove();
                    }
                }
                else if (data.result === 'nok') {
                    if (data.msg !== undefined) {
                        $this.html(old_html);
                        alert(data.msg);
                    }
                }
            }
        });
    });
});