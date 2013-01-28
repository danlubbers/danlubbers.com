//@codekit-prepend "wufoo.js";

(function( $, win, doc ) {
    "use strict";

    var
        ACTIVE              =   'active',
        SHOW                =   'show',
        PREV                =   'previous',
        NEXT                =   'next',
        CURRENT             =   'current',
        PAST                =   'past',

        noop                =   function() {},
        console             =   win.console || {"log": noop, "warn": noop, "error": noop},

        body                =   $('body'),

        nav                 =   $('nav'),
        mobileSelect        =   $("<select />").appendTo(nav),
        mobileNav           =   nav.find('select'),
        portfolio           =   nav.find('#sub-nav'),
        portfolioItems      =   portfolio.find('li'),
        about               =   $('#about'),
        aboutLink           =   $('#about-link'),
        contact             =   $('#contact'),
        contactLink         =   $('#contact-link'),
        closeButton         =   $('.close'),

        prevSlide           =   $('.prev'),
        nextSlide           =   $('.next'),
        isPaused            =   false,
        slides,
        currentSlide,
        currentIndex,

        content             =   $('#content'),
        info                =   $('#info'),
        infoContainer       =   info.find('span'),
        figure              =   content.find('figure'),
        images              =   figure.find('img'),

        title,
        subtitle,

        minHeight           =   0;

    function cycle(){
        if ( isPaused === false ) {
            switchSlide(NEXT);
        }
        setTimeout(function() {
            cycle();
        }, 3000);
    }

    function setup() {
        $("<option />", {
           "selected": "selected",
           "value"   : "",
           "text"    : "Go to..."
        }).appendTo(mobileNav);

        portfolioItems.each(function() {
         var
            el      =   $(this),
            link    =   el.find('a');

         $("<option />", {
             "value"    : link.attr("href"),
             "text"     : el.text()
         }).appendTo(mobileNav);

        });

        if ( body.hasClass('index') ) {
            prevSlide.remove();
            nextSlide.remove();
            cycle();
        } else {
            images.eq(0).addClass(CURRENT);
            switchTitle(images.eq(0));
        }
    }

    function switchTitle( image ) {
        title           =   image.attr('data-title');
        subtitle        =   image.attr('data-subtitle');
        infoContainer.html(title + '&nbsp;<b>' + subtitle + '</b>');
    }

    function switchSlide( direction ) {

        currentSlide    =   figure.find('.current');
        currentIndex    =   currentSlide.index();
        
        if ( direction === PREV ) {
            currentSlide.removeClass(PAST).removeClass(CURRENT);
            if ( currentIndex > 0 ) {
                images.eq(currentIndex - 1).removeClass(PAST).addClass(CURRENT);
                switchTitle(images.eq(currentIndex - 1));
            } else if ( currentIndex === 0 ) {
                images.each(function() {
                    var
                        t   =   $(this),
                        i   =   t.index();
                    console.log(t.index());
                    if ( (i > 0) && (i < (images.length - 1)) ) {
                        t.addClass(PAST);
                    }
                });
                images.eq(images.length - 1).addClass(CURRENT);
                switchTitle(images.eq(images.length - 1));
            } else {
                images.eq(images.length - 1).removeClass(PAST).addClass(CURRENT);
                switchTitle(images.eq(images.length - 1));
            }
        } else {
            currentSlide.removeClass(CURRENT).addClass(PAST);
            if ( currentIndex < (images.length - 1) ) {
                images.eq(parseFloat(currentIndex + 1)).removeClass(PAST).addClass(CURRENT);
                switchTitle(images.eq(parseFloat(currentIndex + 1)));
            }   else {
                images.eq(0).removeClass(PAST).addClass(CURRENT);
                switchTitle(images.eq(0));
                images.each(function() { $(this).removeClass(PAST); });
            }
        }
    }

    // figure.on('mouseenter', function() {
    //     isPaused = true;
    // });

    // figure.on('mouseleave', function() {
    //     isPaused = false;
    // });

    prevSlide.on('click', function(e) {
        e.preventDefault();
        switchSlide(PREV);
    });
    
    nextSlide.on('click', function(e) {
        e.preventDefault();
        switchSlide(NEXT);
    });

    mobileNav.change(function() {
      window.location = $(this).find("option:selected").val();
    });

    aboutLink.on('click', function(e) {
        e.preventDefault();
        $(this).addClass(ACTIVE);
        contactLink.removeClass(ACTIVE);
        about.addClass(SHOW);
        contact.removeClass(SHOW);
    });

    contactLink.on('click', function(e) {
        e.preventDefault();
        $(this).addClass(ACTIVE);
        aboutLink.removeClass(ACTIVE);
        contact.addClass(SHOW);
        about.removeClass(SHOW);
    });

    closeButton.click(function(e){
        e.preventDefault();
        $(this).parent().removeClass(SHOW);
        aboutLink.removeClass(ACTIVE);
        contactLink.removeClass(ACTIVE);
    });

    $(doc.documentElement).keyup(function (event) {
        if (event.keyCode === 27) {
            aboutLink.removeClass(ACTIVE);
            contactLink.removeClass(ACTIVE);
            about.removeClass(SHOW);
            contact.removeClass(SHOW);
        }
    });

    $(document.documentElement).keyup(function (event) {
        if (event.keyCode === 37) {
            if ( !body.hasClass('index') ) {
                switchSlide(PREV);
            }
        } else if (event.keyCode === 39) {
            if ( !body.hasClass('index') ) {
                switchSlide(NEXT);
            }
        }
    });

    setup();

})(jQuery, window, document);