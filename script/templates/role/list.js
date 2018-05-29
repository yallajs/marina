const {fetch} = require('../../../config');

function printRoleTable(roles) {
    return roles.map(role => `
        <tr data-id="${role._id}">
            <td>${role.name || ''}</td>
            <td>${role.accessibility.map(role => role.name).join(', ') || ''}</td>
            <td>
                <i class="far fa-trash-alt" data-id="${role._id}" onclick="event.stopPropagation();app.deleteRole(event);"></i>
            </td>
        </tr>
    `).join('');
}

module.exports = async (req) => {
    let roles = await fetch('v1/roles');
    roles = roles.docs;
    return `
        <style>
            .role-list-table th , td {
                padding: 0.3em;
                
            }
            .role-list-table th  {
                text-align: left;
                font-size: 1.1em;
            }
            
            .role-list-table thead {
                border-bottom: 1px solid #000000;
            }
            
            .role-list-table tr {
                border-bottom: 1px solid #cccccc;
            }
            
            .role-list-table {
                width: 100%;
                font-size: 12px;
                
            }
            .role-list-table tr.selected{
                background: #eeeeee;
            }
        </style>
        <table class="role-list-table" cellspacing="0">
            <thead>
                <tr>
                    <th>Role Name</th>
                    <th>Accessibility</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${printRoleTable(roles)}
            </tbody>
        </table>
        <script>
            (function(exports){
                exports.app = exports.app || {};
                var app = exports.app;
                
                function onTrClicked(event) {
                    document.querySelectorAll('.role-list-table tr').forEach(function(tr){
                        tr.classList.remove('selected');
                    }); 
                    event.currentTarget.classList.add('selected');
                    app.loadRoleForm(event.currentTarget.getAttribute('data-id'));
                }
                
                function populateListeners(){
                    document.querySelectorAll('.role-list-table tr').forEach(function(tr){
                        tr.addEventListener('click',onTrClicked);
                    });    
                }
                
                function deleteRole(event){
                    var id = event.target.getAttribute('data-id');
                    app.showConfirmation('Are you sure you want to delete ?',['Yes','No'],function(button){
                        if(button.innerText === 'Yes' ){
                            fetch('/v1/roles/'+id,{
                                method : 'DELETE',
                                credentials : 'same-origin',
                                header : {
                                    'content-type' : 'application-json'
                                }
                            }).then(function(result){
                                return result.json();
                            }).then(function(){
                                app.showNotification('Role deleted.');
                                refreshRoleListTable();
                                app.clearRoleForm();
                            });        
                        }    
                    });
                    
                    
                }
                
                function refreshRoleListTable(){
                    fetch('/v1/roles').then(function(results){
                        return results.json();
                    }).then(function(result){
                        var roles = result.docs;
                        document.querySelector('.role-list-table tbody').innerHTML = roles.map(function(role){
                            return '<tr data-id="'+role._id+'">' +
                             '<td>'+role.name+'</td>' +
                             '<td>'+role.accessibility.map(function(role){ return role.name }).join(', ')+'</td>' +
                             '<td><i class="far fa-trash-alt" data-id="'+role._id+'" onclick="event.stopPropagation();app.deleteRole(event);"></i></td>' +
                              '</tr>';
                        }).join('');
                        populateListeners();
                    });
                }
                populateListeners();
                exports.app.refreshRoleListTable = refreshRoleListTable;
                exports.app.deleteRole = deleteRole;
            })(window)
            
        </script>
    `
}