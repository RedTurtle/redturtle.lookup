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
    $('a.productAction').each(function() {
        $(this).click(function(event) {
            event.preventDefault();
            var $this = $(this);
            $this.addClass('loading');
            $this.append( '<i class="glyphicon glyphicon-refresh"></i>' );
            $.ajax({
                url: this.href,
                dataType: "json",
                success: function(data) {
                    if (data.result === 'ok') {
                        $this.replaceWith( '<span class="label label-success">Ok</span>' );
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
});