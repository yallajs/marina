let {fetch} = require('../../../config');

const printMenu = (roles) => {
    return roles.reduce((token,role) => {
        if(role) {
            role.accessibility.forEach(accessibility => {
                if (accessibility && accessibility._id && (token.key.indexOf(accessibility._id) < 0)) {
                    token.items.push(accessibility);
                }
            });
        }
        return token;
    },{key:[],items:[]}).items.map(access => {
        return `<a class="menu-item" href="${access.path}">${access.shortName}</a>`;
    }).join('');
};

module.exports = async(req) => {
    let user = false;
    if(req.cookies.sessionId){
        try{
            user = await fetch(`v1/system_active_sessions?sessionId=${req.cookies.sessionId}`);
            user = user.docs[0];
            if(user){
                let roles = await fetch(`v1/system_roles?$ids=${user.account.roles}`);
                user.account.roles = roles;
                for(let i = 0;i<roles.length;i++){
                    let role = roles[i];
                    if(role){
                        let accessibility = await fetch(`v1/system_accessibility?$ids=${role.accessibility}`);
                        role.accessibility = accessibility;
                    }
                }
            }
        }catch(err){
            console.error(err);
        }
    }

    return `
<style>
    .menu {
        border-top:2px solid black;
        border-bottom:1px solid #cccccc;
        display: flex;
        justify-content: flex-end;
    }
    .menu .menu-item{
        display: inline-block;
        padding: 0.3em 0.5em;
        text-decoration: none;
        color: #333;
    }
    .login-form{
        margin: 0px;
        padding:0px;
    }
    .login-form input{
        padding:0.5em;
    }
    
    .login-form .form-item{
        padding:0.3em 0.3em;
        display: flex;
        flex-direction: column;
    }
    .login-form .form-item label{
        font-size: 14px;
    }
    .login-slider{
        position: relative;
        padding:0.5em;
        
        top:0px;
        transition: top 300ms ease-out;
        background-color: #FAFAFA;
        border: 1px solid #CCC;
        border-top : none;
        
    }
    .login-slider.hide {
        top : -300px;
    }
    .login-panel{
        position: relative;
        display: flex;
        justify-content: center;
        height : 0px;
        overflow: hidden;
    }
    
</style>
<div class="menu">
    <div style="width: 100%" class="menu-holder">
        ${user ? printMenu(user.account.roles) : ''}
    </div>
    <div>
        <a href="#" class="menu-item login-logout">
            ${user ? user.account.name : 'Login'}
        </a>
    </div>
</div>
<div style="position: relative;width: 100%">
<div style="position: absolute;width: 100%">
<div class="login-panel">
    <div class="login-slider hide">
        <form class="login-form" onsubmit="return false;" style="width: 300px">
            <div class="form-item">
                <label for="userName" >User Id:</label>
                <input id="userName" placeholder="Email or User ID" class="form-control">
            </div>
            <div class="form-item">
                <label for="password" >Password:</label>
                <input id="password" type="password" placeholder="Password" class="form-control">
            </div>
            <div class="form-item" style="display: flex;justify-content: flex-end;padding:0.5em 0.3em">
                <div style="display: flex;justify-content: flex-end">
                    <button style="margin-right: 0.5em;" class="btn btn-primary login-button">Login</button>
                    <button class="btn cancel-button">Cancel</button>
                </div>
            </div>
        </form>
    </div>
</div>
</div>
</div>
<script>
    (function(exports){
        exports.app = exports.app = {};
        
        var app = exports.app;
        var menuLoginLogout = document.querySelector('.menu-item.login-logout');
        var loginPanel = document.querySelector('.login-panel');
        var slider = document.querySelector('.login-panel .login-slider');
        var loginButton = document.querySelector('.login-panel .login-button');
        var cancelButton = document.querySelector('.login-panel .cancel-button');
        var menuHolder = document.querySelector('.menu .menu-holder');
        
        function populateRolesOnUser(user){
            fetch('/v1/system_roles?$ids='+user.account.roles)
            .then(function(result){
                return result.json();
            })
            .then(function(roles){
                if(roles.errorMessage){
                    app.showNotification(roles.errorMessage);
                    return;
                }
                roles = roles.filter(role => role !== null);
                user.account.roles = roles;
                return Promise.all(roles.map(function(role){
                    return fetch('/v1/system_accessibility?$ids='+role.accessibility);
                }));
            })
            .then(function(results){
                return Promise.all(results.map(function(result){
                    return result.json();
                }));
            })
            .then(function(accessibilities){
                accessibilities.forEach(function(accessibility,index){
                    user.account.roles[index].accessibility = accessibility;
                });
                return user;
            })
            .then(function(user){
                updateMenus();
            });
        };
        
        function loadCurrentUser(){
            app.fetch('/svc/security.get-current-user',{}).then(function(data){
                if(data && data.account){
                    app.user = data;
                    populateRolesOnUser(app.user);
                }
            });
        }
        setTimeout(loadCurrentUser,100);
        
        /**
        * We should call server in next release 
        */
        function getUserMenus() {
            if(app.user){
                return app.user.account.roles.reduce(function(token,role){
                    var accessibilities = role.accessibility;
                    for(var i = 0;i<accessibilities.length;i++){
                        var access = accessibilities[i];
                        if(access && access._id && token.key.indexOf(access._id)<0){
                            token.key.push(access._id);
                            token.items.push(access);
                        }
                    }
                    return token;
                },{key:[],items:[]}).items;
            }
            return [];
        }
        
        
        function updateMenus(){
            var menus = getUserMenus();
            if(menuLoginLogout.innerText == 'Login' && app.user){
                app.showNotification('Successfully logged in as '+app.user.account.name);    
            }
            menuHolder.innerHTML = menus.map(function(menuItem){
                return '<a class="menu-item" href="'+menuItem.path+'">'+menuItem.shortName+'</a>';
            }).join('');
            menuLoginLogout.innerHTML = app.user ? app.user.account.name : 'Login';
        }
        
        
        function onLoginLogut(event) {
            if(app.user){
                app.showConfirmation('Are you sure you wish to logout ? ',['Yes','No'],function(button){
                    if(button.innerText === 'Yes'){
                        app.fetch('/svc/security.logout',{},true).then(function(user){
                            app.showNotification('Successfully logged out');
                            delete app.user;
                            updateMenus();
                            location.href = '/index.html'
                        });
                    }
                })
            }else{
                loginPanel.style.height = 'auto';
                slider.classList.remove('hide');    
            }
        }
        
        function getValue(id){
            return document.getElementById(id).value;
        }
        function loginToServer() {
            var data = {
                userName: getValue('userName'),
                password: getValue('password')
            };
            app.fetch('/svc/security.login',data,false).then(function(user){
                if(user.errorMessage){
                    app.showNotification(user.errorMessage);
                    return;
                }
                app.user = user;
                populateRolesOnUser(app.user);
                
            });
            
        }
        
        loginButton.addEventListener('click',function(event){
            slider.classList.add('hide');
            loginToServer();
            setTimeout(function(){
                loginPanel.style.height = '0px';
            },300)
        });
        
        cancelButton.addEventListener('click',function(event){
            slider.classList.add('hide');
            setTimeout(function(){
                loginPanel.style.height = '0px';
            },300)
        });
        
        menuLoginLogout.addEventListener('click',onLoginLogut)
    })(window);
</script>
`;
};