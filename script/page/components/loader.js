module.exports = (req) => {
    return `
    <style>
            
        .app-loader.hide {
            opacity: 0;
        }
        
        .app-loader {
            transition: opacity 300ms ease-out;
            position: fixed;
            display: none;
            top:0px;
            left: 0px;
            width: 100vw;
            height: 100vh;
            align-items: center;
            background-color: rgba(201, 201, 201, 0.3);
        }
        
        .app-loader .loader-container{
            width:125px;
            height: 125px;
            display: block;
            position: relative;
            margin:auto;
        }
        
        
        .loader-container .block{
            background-color:rgb(168,168,168);
            border:3px solid rgb(168,168,168);
            float:left;
            height:89px;
            margin-left:7px;
            width:23px;
            opacity:0.1;
            animation-name:bounceG;
            -o-animation-name:bounceG;
            -ms-animation-name:bounceG;
            -webkit-animation-name:bounceG;
            -moz-animation-name:bounceG;
            animation-duration:1.5s;
            -o-animation-duration:1.5s;
            -ms-animation-duration:1.5s;
            -webkit-animation-duration:1.5s;
            -moz-animation-duration:1.5s;
            animation-iteration-count:infinite;
            -o-animation-iteration-count:infinite;
            -ms-animation-iteration-count:infinite;
            -webkit-animation-iteration-count:infinite;
            -moz-animation-iteration-count:infinite;
            animation-direction:normal;
            -o-animation-direction:normal;
            -ms-animation-direction:normal;
            -webkit-animation-direction:normal;
            -moz-animation-direction:normal;
            transform:scale(0.7);
            -o-transform:scale(0.7);
            -ms-transform:scale(0.7);
            -webkit-transform:scale(0.7);
            -moz-transform:scale(0.7);
        }
        
        .block.block-1{
            animation-delay:0.45s;
            -o-animation-delay:0.45s;
            -ms-animation-delay:0.45s;
            -webkit-animation-delay:0.45s;
            -moz-animation-delay:0.45s;
        }
        
        .block.block-2{
            animation-delay:0.6s;
            -o-animation-delay:0.6s;
            -ms-animation-delay:0.6s;
            -webkit-animation-delay:0.6s;
            -moz-animation-delay:0.6s;
        }
        
        .block.block-3{
            animation-delay:0.75s;
            -o-animation-delay:0.75s;
            -ms-animation-delay:0.75s;
            -webkit-animation-delay:0.75s;
            -moz-animation-delay:0.75s;
        }
        
        
        
        @keyframes bounceG{
            0%{
                transform:scale(1.2);
                opacity:1;
            }
        
            100%{
                transform:scale(0.7);
                opacity:0.1;
            }
        }
        
        @-o-keyframes bounceG{
            0%{
                -o-transform:scale(1.2);
                opacity:1;
            }
        
            100%{
                -o-transform:scale(0.7);
                opacity:0.1;
            }
        }
        
        @-ms-keyframes bounceG{
            0%{
                -ms-transform:scale(1.2);
                opacity:1;
            }
        
            100%{
                -ms-transform:scale(0.7);
                opacity:0.1;
            }
        }
        
        @-webkit-keyframes bounceG{
            0%{
                -webkit-transform:scale(1.2);
                opacity:1;
            }
        
            100%{
                -webkit-transform:scale(0.7);
                opacity:0.1;
            }
        }
        
        @-moz-keyframes bounceG{
            0%{
                -moz-transform:scale(1.2);
                opacity:1;
            }
        
            100%{
                -moz-transform:scale(0.7);
                opacity:0.1;
            }
        }
    
    </style>
    <div class="app-loader hide">
        <div class="loader-container">
            <div class="block block-1"></div>
            <div class="block block-2"></div>
            <div class="block block-3"></div>
        </div>
    </div>
    
    `
}