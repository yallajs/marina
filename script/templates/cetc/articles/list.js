const {fetch} = require('../../../../config');

function printArticlesTable(articles) {
    return articles.map(article => `
        <tr data-id="${article._id}">
            <td>${article.date || ''}</td>
            <td>${article.title || ''}</td>
            <td>
                <i class="far fa-trash-alt" data-id="${article._id}" onclick="event.stopPropagation();app.deleteArticle(event);"></i>
            </td>
        </tr>
    `).join('');
}

module.exports = async (req) => {
    let articles = await fetch('v1/cetc_articles');
    articles = articles.docs;
    return `
        <style>
            .article-list-table th , td {
                padding: 0.3em;
                
            }
            .article-list-table th  {
                text-align: left;
            }
            
            .article-list-table thead {
                border-bottom: 1px solid #000000;
            }
            
            .article-list-table tr {
                border-bottom: 1px solid #cccccc;
            }
            
            .article-list-table {
                width: 100%;
                
            }
            .article-list-table tr.selected{
                background: #eeeeee;
            }
            
            .col-published-date {
                width: 100px;
            }
        </style>
        <table class="article-list-table" cellspacing="0">
            <col width="200">
            <col width="auto">
            <col width="40">
            <thead>
                <tr style="height: 2.2em;">
                    <th class="col-published-date">Published Date</th>
                    <th>Title</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${printArticlesTable(articles)}
            </tbody>
        </table>
        <script>
            (function(exports){
                exports.app = exports.app || {};
                var app = exports.app;
                
                function onTrClicked(event) {
                    document.querySelectorAll('.article-list-table tr').forEach(function(tr){
                        tr.classList.remove('selected');
                    }); 
                    event.currentTarget.classList.add('selected');
                    app.loadArticleForm(event.currentTarget.getAttribute('data-id'));
                }
                
                function populateListeners(){
                    document.querySelectorAll('.article-list-table tr').forEach(function(tr){
                        tr.addEventListener('click',onTrClicked);
                    });    
                }
                
                function deleteArticle(event){
                    var id = event.target.getAttribute('data-id');
                    app.showConfirmation('Are you sure you want to delete ?',['Yes','No'],function(button){
                        if(button.innerText === 'Yes' ){
                            fetch('/v1/cetc_articles/'+id,{
                                method : 'DELETE',
                                credentials : 'same-origin',
                                header : {
                                    'content-type' : 'application-json'
                                }
                            }).then(function(result){
                                return result.json();
                            }).then(function(){
                                app.showNotification('Article deleted.');
                                refreshArticleListTable();
                                app.clearArticleForm();
                            });        
                        }    
                    });
                    
                    
                }
                
                function refreshArticleListTable(){
                    fetch('/v1/cetc_articles').then(function(results){
                        return results.json();
                    }).then(function(result){
                        var articles = result.docs;
                        document.querySelector('.article-list-table tbody').innerHTML = articles.map(function(article){
                            return '<tr data-id="'+article._id+'">' +
                             '<td>'+article.date+'</td>' +
                             '<td>'+article.title+'</td>' +
                             '<td><i class="far fa-trash-alt" data-id="'+article._id+'" onclick="event.stopPropagation();app.deleteArticle(event);"></i></td>' +
                              '</tr>';
                        }).join('');
                        populateListeners();
                    });
                }
                populateListeners();
                exports.app.refreshArticleListTable = refreshArticleListTable;
                exports.app.deleteArticle = deleteArticle;
            })(window)
            
        </script>
    `
}