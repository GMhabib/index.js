var PROXY = {
    "direct":"DIRECT",
    "gfw":"PROXY 127.0.0.1:8099"
};

var DEFAULT = "direct";

var SECTIONS = [
    {
        "name":"direct",
        "proxy":"direct"
    },
    {
        "name":"gfw",
        "proxy":"gfw"
    }
];

var ALL = {
    "direct":{
        "net":[
            // http://en.wikipedia.org/wiki/Reserved_IP_addresses#Reserved_IPv4_addresses
            "0.0.0.0/8",
            "10.0.0.0/8",
            "100.64.0.0/10",
            "127.0.0.0/8",
            "169.254.0.0/16",
            "172.16.0.0/12",
            "192.0.0.0/29",
            "192.0.2.0/24",
            "192.88.99.0/24",
            "192.168.0.0/16",
            "198.18.0.0/15",
            "198.51.100.0/24",
            "203.0.113.0/24",
            "224.0.0.0/4",
            "240.0.0.0/4",
            "255.255.255.255"
        ],
        "domain":[
        ]
    },
    "gfw":{
        "domain":[
        	".path.com",
        	".serverfault.com",
        	".cloudflare.com",
        	".jetbrains.com",
        	".sstatic.net",
        	".wireshark.org",
        	".shxx.us",
        	".16jiemm.com",
        	".99byou.com",
        	".021gzbb.com",
        	".guizubb.net",
        	".cfg2013.com",
            ".appinn.com",
            ".npmjs.org",
            ".imgtiger.com",
            ".s-msft.com",
            ".wsj.com",
            ".debian.org",
            ".yimg.com",
            ".tmblr.co",
            ".fastly.net",
            ".live.com",
            ".bing.com",
            ".rapidshare.com",
            ".feedly.com",
            ".91porn.com",
            ".wikia.com",
            ".bitbucket.org",
            ".totorojs.org",
            ".softether.org",
            ".newsblur.com",
            ".keakon.net",
            ".reuters.com",
            ".21stp.com",
            ".politicalchina.org",
            ".uwants.com",
            ".petersons.com",
            ".8z1.net",
            ".bitshare.com",
            ".dyo.gs",
            ".any.gs",
            ".doubleclick.net",
            ".meijuwo.com",
            ".newsgator.com",
            ".bloglines.com",
            ".netvibes.com",
            ".2shared.com",
            ".hackdesign.org",
        	".blogspot.com.au",
            ".twitiq.com",
            ".hkgolden.com",
            ".blogimg.jp",
            ".pastebin.com",
            ".storify.com",
            ".i2p2.de",
            ".eslite.com",
            ".books.com.tw",
            ".dmm.co.jp",
            ".torrentcrazy.com",
            ".bitsnoop.com",
            ".uvnc.eu",
            ".uvnc.com",
            ".droidvpn.com",
            ".privatetunnel.com",
            ".rapidshare.com",
            ".globalvoicesonline.org",
            ".oberhumer.com",
            ".ning.com",
            ".libevent.org",
            ".collab.net",
            ".github.com",
            ".igssh.com",
            ".zlib.net",
            ".zhongguotese.net",
            ".secretchina.com",
            ".imagetwist.com",
            ".imgchili.com",
            ".googlegroups.com",
            ".recaptcha.net",
            ".freakshare.com",
            ".google.com.ph",
            ".torproject.org",
            ".cdn.mozilla.net",
            ".userstyles.org",
            ".voachinese.com",
            ".dajiyuan.eu",
            ".facebookstories.com",
            ".cdn-static.com",
            ".googlesource.com",
            ".facebook.net",
            ".facebook.com",
            ".youtu.be",
            ".tumblr.com",
            ".typekit.com",
            ".typekit.net",
            ".git-scm.com",
            ".laahaa.com",
            ".aboluowang.com",
            ".nytimes.com",
            ".mobile01.com",
            ".zygote.com",
            ".zygotebody.com",
            ".tampermonkey.net",
            ".wenweipo.com",
            ".media.tumblr.com",
            ".favstar.fm",
            ".archive.org",
            ".feedvalidator.org",
            ".wikimedia.org",
            "cdn.steampowered.com",
            "cdn.steamcommunity.com",
            "cdn.store.steampowered.com",
            ".ipredator.se",
            ".staticflickr.com",
            ".blogspot.jp",
            ".businessweek.com",
            ".guardian.co.uk",
            ".bloomberg.com",
            ".udn.com.tw",
            ".udn.com",
            ".cloudfront.net",
            ".twiyia.com",
            ".twitpicproxy.com",
            ".chrome.com",
            ".travis-ci.org",
            ".simplecd.me",
            ".simplecd.org",
            ".jav4you.com",
            ".pinterest.com",
            ".ihavesun2012.com",
            ".sourceforge.net",
            ".soundofhope.org",
            ".epochtimes.com",
            ".dw.de",
            ".xuite.net",
            ".tinybucks.net",
            ".qqc.co",
            ".jingpin.org",
            ".slideshare.net",
            ".tysurl.com",
            ".zff.co",
            ".twimg.com",
            "tw.myblog.yahoo.com",
            ".mimip2p.net",
            ".touch99.com",
            "cl.eye.rs",
            ".iphone-dev.org",
            ".owind.com",
            ".posterous.com",
            ".licdn.com",
            ".ykhandler.com",
            ".s3.amazonaws.com",
            ".multiupload.com",
            ".cuophiepgiet.net",
            ".cyanogenmod.com",
            ".careercup.com",
            ".shell909090.com",
            ".igfw.net",
            ".sex.com",
            ".hkreporter.com",
            ".peacehall.com",
            ".elastic.io",
            ".ncchinesenews.com",
            ".henhengan.com",
            ".fb.me",
            ".wretch.cc",
            ".hotfile.com",
            ".ironpython.net",
            ".free.fr",
            ".rudygems.com",
            ".filesonic.com",
            ".openhome.cc",
            ".rubyinstaller.org",
            ".idv.tw",
            ".isohunt.com",
            ".nabble.com",
            ".kanzhongguo.com",
            ".sytes.net",
            ".chinagfw.org",
            ".mediafire.com",
            ".openmymind.net",
            ".spinejs.com",
            ".speakerdeck.com",
            ".thechangelog.com",
            ".imgkeep.com",
            ".dabr.co.uk",
            ".voanews.com",
            ".voachineseblog.com",
            ".voa.mobi",
            ".bbc.in",
            ".bbcchinese.com",
            ".bbc.co.uk",
            ".chinainperspective.com",
            ".mingpao.com",
            ".wuala.com",
            ".boxun.com",
            ".dwnews.com",
            ".dw-world.com",
            ".dw-world.de",
            ".lijit.com",
            ".gravatar.com",
            ".viddler.com",
            ".chzbgr.com",
            ".cheezburger.com",
            ".news.pchome.com.tw",
            ".eddychan.com",
            ".9bis.net",
            ".9bis.com",
            ".libertytimes.com.tw",
            ".cornelcreanga.com",
            ".topsy.com",
            ".xys.org",
            ".golang.org",
            ".youtube.com",
            ".vimeo.com",
            ".blip.tv",
            ".twerpscan.com",
            ".edubridge.com",
            ".uncyclopedia.info",
            ".goodreads.com",
            ".disqus.com",
            ".marguerite.su",
            ".kenengba.com",
            ".lnkd.in",
            ".wmoov.com",
            ".9city.me",
            ".twitlonger.com",
            ".yegle.net",
            ".paper.li",
            ".biantailajiao.com",
            ".nodeknockout.com",
            ".igfw.tk",
            ".mitbbs.com",
            ".aculo.us",
            ".zeptojs.com",
            ".openvpn.net",
            ".4bsd.biz",
            ".tabsugar.com",
            ".bitly.com",
            ".addthiscdn.com",
            ".ggpht.com",
            ".tv.com",
            ".android-x86.org",
            ".rfa.org",
            ".cld.me",
            ".mashable.com",
            ".nextmedia.com",
            ".appleactionews.com",
            ".mobileways.de",
            ".pixfs.net",
            ".pixnet.net",
            ".blip.tv",
            ".scribd.com",
            ".voanews.com",
            ".android.com",
            ".gstatic.com",
            ".chromium.org",
            ".t66y.com",
            ".letscorp.net",
            ".epfl.ch",
            ".snsanalytics.com",
            ".tweetmeme.com",
            ".smf.is",
            ".r246.jp",
            ".wordpress.com",
            ".wp.com",
            ".rfi.fr",
            ".wezone.net",
            ".wikipedia.org",
            ".chinadigitaltimes.net",
            ".bit.ly",
            ".googleapis.com",
            ".analyticsrock.com",
            ".sns.mx",
            ".solidot.org.feedsportal.com",
            ".pocoo.org",
            ".linkedin.com",
            ".fnierdster.com",
            ".milewise.com",
            ".picplz.com",
            ".t.co",
            ".ytimg.com",
            ".google.com",
            ".googleusercontent.com",
            ".googlepages.com",
            ".googlevideo.com",
            ".googlecode.com",
            ".appspot.com",
            ".blogspot.com",
            ".google-analytics.com",
            ".rene-liu.com",
            ".4shared.com",
            ".twitter.com",
            ".twitpic.com",
            ".img.ly",
            ".j.mp",
            ".yfrog.com",
            ".fbcdn.net",
            ".feedburner.com",
            ".foursquare.com",
            ".bullogger.com",
            ".diigo.com",
            ".dropbox.com",
            ".ht.ly",
            ".hootsuite.com",
            ".imageshack.us",
            ".imdb.com",
            ".mail-archive.com",
            ".mobypicture.com",
            ".ow.ly",
            ".pastie.org",
            ".plixi.com",
            ".plurk.com",
            ".wp.me",
            ".nyti.ms",
            ".googlesyndication.com",
            ".page2rss.com",
            ".dhananjaynene.com",
            ".twbbs.org.tw",
            ".llvm.org",
            ".tweetdeck.com",
            ".thepiratebay.se",
            ".thepiratebay.org",
            ".apigee.com",
            ".cl.ly",
            ".guao.cc",
            ".vimeo.com",
            ".wdfiles.com",
            ".ohloh.net",
            ".googlelabs.com",
            ".creaders.net",
            ".pulse.yahoo.com",
            ".blogger.com",
            ".google.com.hk",
            "go.redirectingat.com",
            ".faststone.org",
            ".the-big-bang-theory.com",
            ".echofon.com",
            ".goo.gl",
            ".hackerne.ws",
            ".friendfeed.com"
        ],
        "keyword":[
            "python.org/download/"
        ]
    }
};

function dnsDomainIs(host, pattern) {
    if (pattern.charCodeAt(0) === 46) { // pattern[0] === "."
        return host === pattern.slice(1) ||
            (host.length >= pattern.length && host.substring(host.length - pattern.length) === pattern); // original dnsDomainIs function
    }
    return host === pattern;
}

function keywordMatch(url, pattern) {
    return url.indexOf(pattern) >= 0;
}

function convertAddr(ipchars) {
    var bytes = ipchars.split('.');
    return (((bytes[0] & 0xff) << 24) |
        ((bytes[1] & 0xff) << 16) |
        ((bytes[2] & 0xff) << 8) |
        (bytes[3] & 0xff)) >>> 0;
}

function validateIp(ipaddr) {
    var test = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ipaddr);
    return !((test == null) || (test[1] > 255 || test[2] > 255 || test[3] > 255 || test[4] > 255));
}

function isInNet(ipaddr, pattern) {
    if (validateIp(ipaddr)) {
        var tmp = pattern.split("/");
        pattern = tmp[0];
        if (validateIp(pattern)) {
            var host = convertAddr(ipaddr),
                pat = convertAddr(pattern),
                mask;
            if (typeof tmp[1] !== "undefined") {
                mask = 32 - tmp[1];
                mask = ((0xffffffff >> mask) << mask) >>> 0;
            }
            else {
                mask = 0xffffffff >>> 0;
            }
            return ((host & mask) == (pat & mask));
        }
    }
    return false;
}

function validatorBuilder(func, str) {
    return function (pattern) {
        return func(str, pattern);
    };
}

function FindProxyForURL(url, host) {
    if (isPlainHostName(host)) {
        return "direct";
    }
    var validators = {
            "net":validatorBuilder(isInNet, host),
            "domain":validatorBuilder(dnsDomainIs, host),
            "keyword":validatorBuilder(keywordMatch, url)
        },
        sectionsLength = SECTIONS.length,
        ruleType,
        rules,
        rulesLength,
        section,
        sectionId,
        sectionName,
        sectionProxy,
        sectionRules,
        ruleId;
    for (sectionId = 0; sectionId < sectionsLength; sectionId += 1) {
        section = SECTIONS[sectionId];
        sectionName = section["name"];
        sectionProxy = section["proxy"];
        if (ALL.hasOwnProperty(sectionName) && PROXY.hasOwnProperty(sectionProxy)) {
            sectionRules = ALL[sectionName];
            for (ruleType in sectionRules) {
                if (sectionRules.hasOwnProperty(ruleType) && validators.hasOwnProperty(ruleType)) {
                    rules = sectionRules[ruleType];
                    rulesLength = rules.length;
                    for (ruleId = 0; ruleId < rulesLength; ruleId += 1) {
                        if (!!((validators[ruleType])(rules[ruleId]))) {
                            return PROXY[sectionProxy];
                        }
                    }
                }
            }
        }
    }
    return PROXY[DEFAULT];
}
