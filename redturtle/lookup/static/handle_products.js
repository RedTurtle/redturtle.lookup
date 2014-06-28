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
        $this.addClass('loading');
        $this.append( '<i class="glyphicon glyphicon-refresh"></i>' );
        $.ajax({
            url: this.href,
            dataType: "json",
            success: function(data) {
                var $this_data = $this.data();
                if (data.result === 'ok') {
                    if (data.new_state === 'installed') {
                        $this.parent().attr('class', 'productInfo success');
                        html = '<a class="productAction label label-danger"';
                        html +=' href="' + $this_data.portalUrl + '/@@handle-products?action=uninstall&product=' + $this_data.productId + '"';
                        html += ' data-portal-url="' + $this_data.portalUrl + '"';
                        html += ' data-product-id="' + $this_data.productId + '"';
                        html += ' data-uninstall-label="' + $this_data.uninstallLabel + '"';
                        html += ' data-install-label="' + $this_data.installLabel + '"';
                        html += ' ">';
                        html += $this_data.uninstallLabel + '</a>';
                        $this.replaceWith( html );
                    }
                    else if (data.new_state === 'uninstalled') {
                        $this.parent().attr('class', 'productInfo');
                        html = '<a class="productAction label label-default"';
                        html +=' href="' + $this_data.portalUrl + '/@@handle-products?action=install&product=' + $this_data.productId + '"';
                        html += ' data-portal-url="' + $this_data.portalUrl + '"';
                        html += ' data-product-id="' + $this_data.productId + '"';
                        html += ' data-uninstall-label="' + $this_data.uninstallLabel + '"';
                        html += ' data-install-label="' + $this_data.installLabel + '"';
                        html += '">';
                        html += $this_data.installLabel + '</a>';
                        $this.replaceWith( html );
                    }
                }
                else if (data.result === 'nok') {
                    $this.removeClass('loading');
                    $('i.glyphicon-refresh').remove();
                    if (data.msg !== undefined) {
                        alert(data.msg);
                    }
                }
            }
        });
    });
});