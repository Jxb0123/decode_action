//Sat Jun 21 2025 11:00:07 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
let mode = __dirname.includes("Work");
const fs = require("fs"),
  axios = require("axios"),
  {
    format,
    addDays,
    differenceInMinutes
  } = require("date-fns"),
  path = require("path"),
  machineId = require("node-machine-id"),
  tunnel = require("tunnel"),
  Redis = require("ioredis"),
  CryptoJS = require("crypto-js"),
  {
    jsToken
  } = require("./assets/jsToken"),
  notify = require("./sendNotify"),
  cheerio = require("cheerio"),
  base64 = require("base-64"),
  jdCookieNode = require("./jdCookie.js");
let NodeRSA = require("node-rsa"),
  cookiesArr = [];
Object.keys(jdCookieNode).forEach(_0x5629b7 => {
  cookiesArr.push(jdCookieNode[_0x5629b7]);
});
let basePath = process.env.M_CONF_BASE_PATH || __dirname + "/conf";
const conf = JSON.parse(fs.readFileSync(basePath + "/utopia.json").toString());
function getValue(_0x34d524, _0x153479 = "") {
  return conf[_0x34d524] || process.env[_0x34d524] || _0x153479;
}
const redis = new Redis(getValue("M_REDIS_URL"), {
  "keyPrefix": "magic:"
});
let accountPath = basePath + "/account.json";
const $ = axios.create({
  "timeout": getValue("M_TIMEOUT", 5000)
});
$.defaults.headers.Accept = "*/*";
$.defaults.headers.Connection = "keep-alive";
$.defaults.headers["Accept-Language"] = "zh-CN,zh-Hans;q=0.9";
$.defaults.headers["Accept-Encoding"] = "gzip, deflate, br";
$.defaults.headers.common.Cookie = machineId.machineIdSync();
class CustomError extends Error {
  constructor(_0x181852) {
    super(_0x181852);
    this.name = "CustomError";
  }
}
const proxyUrl = new URL(getValue("M_WX_PROXY_POOL_URL")),
  params = new URLSearchParams(proxyUrl.search),
  clientVersion = getValue("M_SIGN_CLIENT_VERSION", "12.4.4"),
  users = new Map(),
  taskQueue = [],
  authUrls = getValue("M_AUTH_URLS", getValue("M_AUTH_URL", "")).split(",").filter(_0x54c870 => _0x54c870.trim()),
  tokenPath = getValue("M_WX_TOKEN_PATH", "");
let keywords = ["pps", "utm_campaign", "utm_term", "utm_source", "utm_medium", "teamId", "mpin", "shareUuid", "signUuid", "inviterNick", "inviter", "InviteUuid", "inviterNickName", "sharer", "inviterImg", "nickName", "nick", "friendUuid", "helpUuid", "shareuserid4minipg", "bizExtString", "invitePin", "pps", "cookie", "friendid", "bizExtString", "bizExtString", "koikey", "jd_env_info", "inviter_id", "invitePin", "portrait", "sid", "shareUserId", "_ts", "tttparams", "pps", "pps", "DEBUG", "shareOpenId", "jxsid", "ad_od", "un_area", "encryptOpenId", "gx", "gxd", "accessToken"],
  activityIdRegx = ["/(dz[a-zA-Z0-9]{28,32})", "pagec/(unionOpen\\w+)/index", "activityId=(\\w+)", "exchange_id=(\\w+)", "giftId=(\\w+)", "actId=(\\w+)", "tplId=(\\w+)", "token=(\\w+)", "active/(\\w+)/index", "code=(\\w+)", "a=(\\w+)", "id=(\\w+)"],
  urlPrefixes = {
    "/prod/cc/interactsaas": /interactsaas/,
    "/crm-proya/apps/interact": /crm-proya/,
    "/apps/interact": /lorealjdcampaign-rc.isvjcloud.com/,
    "prod/cc/cjwx": /lorealjdcampaign-rc.isvjcloud.com\/prod\/cc\/cjwx/,
    "/prod/cc/interaction/v1": /interaction\/v1/,
    "/prod/cc/interaction/v2": /interaction\/v2/
  },
  notInitPinTokenRegex = /(lorealjdcampaign-rc.isvjcloud.com|lzdz\\d+|interaction\/v1)/,
  tokenCacheMin = getValue("M_WX_TOKEN_CACHE_MIN"),
  tokenCacheMax = getValue("M_WX_TOKEN_CACHE_MAX"),
  addressStopRegx = new RegExp("(" + getValue("M_WX_ADDRESS_STOP_KEYWORD").split("@").join("|") + ")"),
  notOpenCardFilenameRegx = new RegExp("(" + getValue("M_WX_NOT_OPEN_FILENAME", "xxx@xxx").split("@").join("|") + ")"),
  exitKeywordRegx = /""/,
  disableLogUrlRegx = /""/,
  exitRuleKeywordRegx = /""/,
  exitActNameKeywordRegx = /""/,
  ruleSimplifyKeywordRegx = /""/,
  exitShopKeywordRegx = /""/,
  autoCachedRegx = /""/,
  autoCachedForeverRegx = /""/,
  autoCachedForeverHotRegx = /""/,
  successMessageRegx = /""/,
  breakKeywordRegx = /""/,
  retryApiKeywordRegx = /""/,
  utopia = {};
class Env {
  constructor(_0x513ac0) {
    if (this.constructor === Env) {
      this.name = "" + _0x513ac0;
      this.desensitize = false;
      this.concNum = 0;
      this.runningNum = 0;
      this.exit = false;
      this.domain = "";
      this.baseActivityId = "";
      this.actName = "";
      this.activityId = "";
      this.activityUrl = "";
      this.activityType = "";
      this.templateId = "";
      this.templateCode = "";
      this.rule = "";
      this.defenseUrls = [];
      this.urlPrefix = "";
      this.shopName = "";
      this.venderId = "";
      this.shopId = "";
      this.superVersion = "v1.1.0";
      this.superVersionNum = this.superVersion.replace(/\D/g, "") * 1;
      $.defaults.headers.common.Cookie = machineId.machineIdSync();
      this.prizeList = [];
      this.accounts = [];
      this.currAddressPtpin = "";
      this.addressIndex = 1;
      this.enableCookieFilter = true;
      this.cookieTypes = "";
      this.forceCookieTypes = "";
      this.enableMasterPtpins = "";
      this.disablePtpins = "";
      this.enablePtpins = "";
      this.masterPins = [];
      this.maxCookie = getValue("M_MAX_COOKIE");
      this.enableMasterSort = false;
      this.enableRunCache = true;
      this.hotKey = "unknown";
      this.masterNum = 0;
      this.filename = path.parse(process.argv[1]).name;
      this.currentTime = Date.now();
      this.__st = Date.now();
      this.log("" + this.name);
      this.retryRegx = "timeout@socket";
      this.retryCount = 2;
      this.retryInterval = 0;
      this.isvjcloud = false;
      this.referer = "";
      this.origin = "";
      this.helpUserId = "";
      this.proxy = false;
      this.protocol = "https";
      this.msg = [];
      this.isHdbAct = false;
      this.isTxzjAct = false;
      this.isHzbzAct = false;
      this.isLzdzAct = false;
      this.isJinggengjcqAct = false;
      this.isJinggengAct = false;
      this.isGzslAct = false;
      this.isV2Act = false;
      this.isV1Act = false;
      this.isCommonAct = false;
      this.isSzxyunAct = false;
      this.logGenCacheKey = false;
      this.authUrls = authUrls.length ? authUrls : [];
      this.commandLineArgs();
      return;
    }
    this.index = 0;
    this.isMember = false;
    this.isNewMember = false;
    this.isNotOpenCard = false;
    this.cookie = "";
    this.ptpin = "";
    this.ptkey = "";
    this.version = "";
    this.ticket = "";
    this.tickets = new Map();
    this.Token = "";
    this.isvToken = "";
    this.Pin = "";
    this.nickname = "";
    this.secretPin = "";
    this.message = [];
  }
  ["different"](_0x4895d8, _0x191fcb) {
    const _0x335b50 = _0x4895d8.map(_0x329ac9 => _0x329ac9 + "").filter(_0x584f80 => !_0x191fcb.map(_0x473d87 => _0x473d87 + "").includes(_0x584f80)),
      _0x5cca38 = _0x191fcb.map(_0x24a484 => _0x24a484 + "").filter(_0x44f158 => !_0x4895d8.map(_0x595f7b => _0x595f7b + "").includes(_0x44f158));
    return _0x335b50.concat(_0x5cca38);
  }
  ["commandLineArgs"]() {
    const _0xe693f5 = process.argv.slice(2),
      _0x5b65ad = {};
    for (let _0x185a3e = 0; _0x185a3e < _0xe693f5.length; _0x185a3e++) {
      const _0x194a10 = _0xe693f5[_0x185a3e];
      if (_0x194a10.startsWith("--")) {
        const [_0x2f51b8, _0x40acd5] = _0x194a10.slice(2).split("=");
        if (_0x2f51b8 && _0x40acd5) {
          if (["disablePtpins", "enableMasterPtpins", "ptpins", "forceCookieTypes", "cookieTypes"].includes(_0x2f51b8) && !_0x40acd5.includes(",")) _0x5b65ad[_0x2f51b8] = [_0x40acd5];else {
            _0x5b65ad[_0x2f51b8] = this.parseValue(_0x40acd5);
          }
        }
      }
    }
    Object.assign(this, _0x5b65ad);
  }
  ["textToVector"](_0x4d88c9) {
    let _0x5b6224 = _0x4d88c9.split(/[^\w]+/).filter(Boolean),
      _0x50ebc7 = {};
    for (let _0x32cfcf of _0x5b6224) {
      _0x50ebc7[_0x32cfcf] = (_0x50ebc7[_0x32cfcf] || 0) + 1;
    }
    return _0x50ebc7;
  }
  ["cosineSimilarity"](_0x47c864, _0xaf1fb3) {
    let _0x587494 = 0,
      _0x406bf5 = 0,
      _0x134d9d = 0;
    for (let _0x4d58e0 in _0x47c864) {
      _0xaf1fb3.hasOwnProperty(_0x4d58e0) && (_0x587494 += _0x47c864[_0x4d58e0] * _0xaf1fb3[_0x4d58e0]);
      _0x406bf5 += Math.pow(_0x47c864[_0x4d58e0], 2);
    }
    for (let _0x1c3a99 in _0xaf1fb3) {
      _0x134d9d += Math.pow(_0xaf1fb3[_0x1c3a99], 2);
    }
    return _0x406bf5 = Math.sqrt(_0x406bf5), _0x134d9d = Math.sqrt(_0x134d9d), _0x587494 / (_0x406bf5 * _0x134d9d);
  }
  ["textSimilarity"](_0x48be13, _0x4ad348) {
    let _0x34cecb = this.textToVector(_0x48be13),
      _0xf9ac48 = this.textToVector(_0x4ad348);
    return this.cosineSimilarity(_0x34cecb, _0xf9ac48) * 100;
  }
  ["arrDelItem"](_0x510d51, _0x149488) {
    let _0x33acd4 = _0x510d51.indexOf(_0x149488);
    if (_0x33acd4 !== -1) {
      _0x510d51.splice(_0x33acd4, 1);
    }
  }
  ["parseValue"](_0x59cdf5) {
    if (!isNaN(_0x59cdf5)) return parseFloat(_0x59cdf5);else {
      if (_0x59cdf5 === "true" || _0x59cdf5 === "false") return _0x59cdf5 === "true";else {
        if (_0x59cdf5.includes(",")) return _0x59cdf5.split(",");else {
          return _0x59cdf5;
        }
      }
    }
  }
  ["log"](..._0x234227) {
    const _0x15fe27 = Date.now();
    this.currentTime && (this.currentTime = _0x15fe27);
    this.super?.["currentTime"] && (this.super.currentTime = _0x15fe27);
    console.log(this.now("HH:mm:ss.SSS") + "|" + (this.index || "") + "|" + (this.ptpin || "") + "|" + (this.currentIp || "") + "|", ..._0x234227);
  }
  ["obj2QueryString"](_0x368740) {
    return Object.keys(_0x368740).map(_0x313324 => _0x313324 + "=" + encodeURIComponent(_0x368740[_0x313324] instanceof Object ? JSON.stringify(_0x368740[_0x313324]) : _0x368740[_0x313324])).join("&");
  }
  ["now"](_0x322eac) {
    return format(Date.now(), _0x322eac || "yyyy-MM-dd HH:mm:ss.SSS");
  }
  ["cdm"](_0x384ab9, _0x938bca) {
    this[_0x384ab9] = eval("(" + _0x938bca + ")");
  }
  ["match"](_0x386fa0, _0x47d029) {
    _0x386fa0 = _0x386fa0 instanceof Array ? _0x386fa0 : [_0x386fa0];
    for (let _0x5250bf of _0x386fa0) {
      const _0x2d8ab5 = _0x5250bf.exec(_0x47d029);
      if (_0x2d8ab5) {
        const _0x55b67b = _0x2d8ab5.length;
        if (_0x55b67b === 1) {
          return _0x2d8ab5;
        } else {
          if (_0x55b67b === 2) return _0x2d8ab5[1];else {
            const _0x37c153 = [];
            for (let _0x2a5f1d = 1; _0x2a5f1d < _0x55b67b; _0x2a5f1d++) {
              _0x37c153.push(_0x2d8ab5[_0x2a5f1d]);
            }
            return _0x37c153;
          }
        }
      }
    }
    return "";
  }
  ["capitalizeFirstUpper"](_0x1707f8) {
    return _0x1707f8.replace(/\b\w/g, function (_0x4eefed) {
      return _0x4eefed.toUpperCase();
    });
  }
  ["sortBySpecifiedOrder"](_0x4d3599, _0x3cebf4) {
    return _0x4d3599.sort((_0x584efd, _0x2a55a1) => {
      if (_0x584efd.match(/pt_pin=(.+?);/)) {
        const _0x51f2a9 = _0x3cebf4.indexOf(_0x584efd.match(/pt_pin=(.+?);/)[1]),
          _0xa3caec = _0x3cebf4.indexOf(_0x2a55a1.match(/pt_pin=(.+?);/)[1]);
        if (_0x51f2a9 === -1) return 1;
        if (_0xa3caec === -1) {
          return -1;
        }
        return _0x51f2a9 - _0xa3caec;
      } else {
        if (_0x584efd.match(/pin=(.+?);/)) {
          const _0x21dbc2 = _0x3cebf4.indexOf(_0x584efd.match(/pin=(.+?);/)[1]),
            _0x4cf893 = _0x3cebf4.indexOf(_0x2a55a1.match(/pin=(.+?);/)[1]);
          if (_0x21dbc2 === -1) return 1;
          if (_0x4cf893 === -1) return -1;
          return _0x21dbc2 - _0x4cf893;
        }
      }
      const _0x4f8a2a = _0x3cebf4.indexOf(_0x584efd),
        _0x34ab56 = _0x3cebf4.indexOf(_0x2a55a1);
      if (_0x4f8a2a === -1) return 1;
      if (_0x34ab56 === -1) return -1;
      return _0x4f8a2a - _0x34ab56;
    });
  }
  ["randomArray"](_0x3edb9d, _0x4f8dfd) {
    _0x4f8dfd = _0x4f8dfd || _0x3edb9d.length;
    let _0x4792ac = _0x3edb9d.slice(0),
      _0x21e472 = _0x3edb9d.length,
      _0x381bd0 = _0x21e472 - _0x4f8dfd,
      _0x20229c,
      _0x2ca812;
    while (_0x21e472-- > _0x381bd0) {
      _0x2ca812 = Math.floor((_0x21e472 + 1) * Math.random());
      _0x20229c = _0x4792ac[_0x2ca812];
      _0x4792ac[_0x2ca812] = _0x4792ac[_0x21e472];
      _0x4792ac[_0x21e472] = _0x20229c;
    }
    return _0x4792ac.slice(_0x381bd0);
  }
  ["wxAddressStop"](_0x815e9f) {
    if (!_0x815e9f || this.super.filename.includes("address")) {
      return false;
    }
    this.checkExitRule();
    if (getValue("M_WX_ADDRESS_DISABLE_ZM", false) && /(专卖店|专营店)/.test(this.super.shopName)) {
      return this.putMsg("#专卖店，不填写地址！"), true;
    }
    const _0x45b50e = this.match(addressStopRegx, _0x815e9f);
    if (_0x45b50e) return this.putMsg("命中关键词，不填写地址！ #" + _0x45b50e), true;
    return false;
  }
  ["formatDateString"](_0x3c5083) {
    let _0x1d5be8 = _0x3c5083.replace("年", "-").replace("月", "-").replace("日", "-"),
      _0x2ee278 = _0x1d5be8.split(" "),
      _0x472093 = _0x2ee278[0],
      _0x4983cc = _0x2ee278?.[1] || "23:59:59",
      _0x1f1458 = _0x4983cc.split(":"),
      _0x270ea8 = _0x472093.split("-"),
      _0x3e782e = "";
    if (_0x270ea8.length === 3) {
      _0x270ea8[0].length === 2 ? _0x3e782e = "20" + _0x270ea8[0] : _0x3e782e = "" + _0x270ea8[0];
      _0x270ea8[1].length === 1 ? _0x3e782e += "-0" + _0x270ea8[1] : _0x3e782e += "-" + _0x270ea8[1];
      if (_0x270ea8[2].length === 1) {
        _0x3e782e += "-0" + _0x270ea8[2];
      } else _0x3e782e += "-" + _0x270ea8[2];
    }
    if (_0x1f1458.length === 3) {
      if (_0x1f1458[0].length === 1) _0x3e782e += " 0" + _0x1f1458[0];else {
        _0x3e782e += " " + _0x1f1458[0];
      }
      if (_0x1f1458[1].length === 1) {
        _0x3e782e += ":0" + _0x1f1458[1];
      } else {
        _0x3e782e += ":" + _0x1f1458[1];
      }
      _0x1f1458[2].length === 1 ? _0x3e782e += ":0" + _0x1f1458[2] : _0x3e782e += ":" + _0x1f1458[2];
    } else {
      if (_0x1f1458[0].length === 1) _0x3e782e += " 0" + _0x1f1458[0];else {
        _0x3e782e += " " + _0x1f1458[0];
      }
      _0x1f1458[1].length === 1 ? _0x3e782e += ":0" + _0x1f1458[1] : _0x3e782e += ":" + _0x1f1458[1];
      _0x3e782e += ":00";
    }
    return _0x3e782e;
  }
  ["getQueryString"](_0x33e71d, _0x34470e) {
    let _0x3c851d = new RegExp("(^|[&?])" + _0x34470e + "=([^&]*)(&|$)"),
      _0x406c42 = _0x33e71d.match(_0x3c851d);
    if (_0x406c42 != null && _0x406c42[2] !== "undefined") return decodeURIComponent(_0x406c42[2]);
    return "";
  }
  ["runCacheKey"]() {
    return [];
  }
  ["remaining"](_0x436567 = new Date()) {
    return Math.floor(new Date(_0x436567.getFullYear(), _0x436567.getMonth(), _0x436567.getDate() + 1) - _0x436567);
  }
  ["parseDate"](_0x11eb81) {
    return new Date(Date.parse(_0x11eb81.replace(/-/g, "/")));
  }
  ["filterUrl"](_0x4fc458) {
    if (!_0x4fc458) {
      return "";
    }
    const _0x425ca9 = new URL(_0x4fc458),
      _0x213290 = new URLSearchParams(_0x425ca9.search),
      _0x544350 = new URLSearchParams();
    for (const [_0x503395, _0x1c986a] of _0x213290.entries()) {
      !keywords.includes(_0x503395) && _0x544350.append(_0x503395, _0x1c986a);
    }
    return _0x425ca9.search = _0x544350.toString(), _0x425ca9.toString();
  }
  ["getActivityId"](_0x166930 = this.activityUrl) {
    for (const _0x5bc273 of activityIdRegx) {
      this.activityId = this.match(new RegExp(_0x5bc273), _0x166930);
      if (this.activityId) {
        break;
      }
    }
    return this.activityId;
  }
  ["random"](_0x1a0ca3, _0x5c9a42) {
    return Math.min(Math.floor(_0x1a0ca3 + Math.random() * (_0x5c9a42 - _0x1a0ca3)), _0x5c9a42);
  }
  ["addTask"](_0x40bccc) {
    taskQueue.push(_0x40bccc);
    this.runTasks();
  }
  ["randomString"](_0x1be711, _0x102db0 = this.ALL_HEX) {
    let _0x4064ad = "";
    for (let _0x3a048d = 0; _0x3a048d < _0x1be711; _0x3a048d++) {
      _0x4064ad += _0x102db0[Math.floor(Math.random() * _0x102db0.length)];
    }
    return _0x4064ad;
  }
  ["randomPattern"](_0x21f464, _0x14d826 = this.ALL_HEX) {
    let _0x2ec2b6 = "";
    for (let _0x586ad1 of _0x21f464) {
      if (_0x586ad1 === "x") _0x2ec2b6 += _0x14d826.charAt(Math.floor(Math.random() * _0x14d826.length));else {
        if (_0x586ad1 === "X") {
          _0x2ec2b6 += _0x14d826.charAt(Math.floor(Math.random() * _0x14d826.length)).toUpperCase();
        } else _0x2ec2b6 += _0x586ad1;
      }
    }
    return _0x2ec2b6;
  }
  ["splitArray"](_0x1d4129, _0x7562f2) {
    const _0x448990 = Math.ceil(_0x1d4129.length / _0x7562f2),
      _0x5dd08b = [];
    for (let _0xe5441a = 0; _0xe5441a < _0x1d4129.length; _0xe5441a += _0x448990) {
      const _0x511cb0 = _0x1d4129.slice(_0xe5441a, _0xe5441a + _0x448990);
      _0x5dd08b.push(_0x511cb0);
    }
    return _0x5dd08b;
  }
  ["desensitizeString"](_0x273dbd) {
    if (!this.desensitize) return _0x273dbd || "";
    if (_0x273dbd.length <= 4) {
      return _0x273dbd;
    }
    const _0x2f70d1 = _0x273dbd,
      _0x324aca = _0x2f70d1.substring(0, 3),
      _0x566ecd = _0x2f70d1.substring(_0x2f70d1.length - 3),
      _0x368925 = Math.max(0, 8 - _0x324aca.length - _0x566ecd.length),
      _0x55361e = "*".repeat(_0x368925);
    return (_0x324aca + _0x55361e + _0x566ecd).padEnd(6, "*");
  }
  ["isNumber"](_0x3d9a6e) {
    return /\d+$/.test(_0x3d9a6e) && !isNaN(_0x3d9a6e);
  }
  ["formatDate"](_0x227cc7, _0x4ac46 = "yyyy-MM-dd HH:mm:ss") {
    return format(typeof _0x227cc7 === "object" ? _0x227cc7 : new Date(typeof _0x227cc7 === "string" ? _0x227cc7 * 1 : _0x227cc7), _0x4ac46 || "yyyy-MM-dd");
  }
  ["formatDateTime"](_0x2887d5, _0x4480a3) {
    return format(typeof _0x2887d5 === "object" ? _0x2887d5 : new Date(typeof _0x2887d5 === "string" ? _0x2887d5 * 1 : _0x2887d5), _0x4480a3 || "yyyy-MM-dd HH:mm:ss");
  }
  ["isMaster"](_0x32a3e8 = this.ptpin) {
    return this.super?.["masterPins"]?.["includes"](_0x32a3e8) || this.index <= this.masterNum;
  }
  ["hasChinese"](_0x4a45d2) {
    return /[\u4e00-\u9fa5]/.test(_0x4a45d2);
  }
  ["timestamp"]() {
    return new Date().getTime();
  }
  ["checkExitRule"](_0x5262e5 = this.super.rule) {
    if (!_0x5262e5 || this.super.isCheckExitRule) {
      return;
    }
    const _0x321ccd = this.match(exitRuleKeywordRegx, _0x5262e5);
    if (_0x321ccd) throw new CustomError("依据规则,垃圾活动,#" + _0x321ccd);
    this.super.isCheckExitRule = true;
  }
  ["checkExitShop"](_0xdfbdac = this.super.shopName) {
    if (!this.isvjcloud || !_0xdfbdac || this.super.isCheckExitShop) return;
    if (exitShopKeywordRegx.test(_0xdfbdac) && !this.super.filename.includes("address")) {
      throw new CustomError("店铺黑名单");
    }
    this.super.isCheckExitShop = true;
  }
  ["getEnv"](_0x5583ee, _0x788ea8 = "") {
    return getValue(_0x5583ee, _0x788ea8);
  }
  ["hasMethod"](_0x3ebfca) {
    return typeof this[_0x3ebfca] === "function";
  }
  ["groupBy"](_0x4d02fd, _0x3505e0) {
    const _0x3c8ee8 = {};
    return _0x4d02fd.forEach(function (_0x26fad6) {
      const _0x25296f = _0x3505e0(_0x26fad6);
      _0x3c8ee8[_0x25296f] = _0x3c8ee8[_0x25296f] || [];
      _0x3c8ee8[_0x25296f].push(_0x26fad6);
    }), _0x3c8ee8;
  }
  ["utf8Encode"](_0x3d6942) {
    _0x3d6942 = _0x3d6942.replace(/rn/g, "n");
    var _0x1f00c5 = "";
    for (var _0x51d068 = 0; _0x51d068 < _0x3d6942.length; _0x51d068++) {
      var _0x340f17 = _0x3d6942.charCodeAt(_0x51d068);
      if (_0x340f17 < 128) _0x1f00c5 += String.fromCharCode(_0x340f17);else _0x340f17 > 127 && _0x340f17 < 2048 ? (_0x1f00c5 += String.fromCharCode(_0x340f17 >> 6 | 192), _0x1f00c5 += String.fromCharCode(_0x340f17 & 63 | 128)) : (_0x1f00c5 += String.fromCharCode(_0x340f17 >> 12 | 224), _0x1f00c5 += String.fromCharCode(_0x340f17 >> 6 & 63 | 128), _0x1f00c5 += String.fromCharCode(_0x340f17 & 63 | 128));
    }
    return _0x1f00c5;
  }
  ["base64ModEncode"](_0x316300, _0x344efe) {
    _0x344efe = _0x344efe || "KLMNOPQRSTABCDEFGHIJUVWXYZabcdopqrstuvwxefghijklmnyz0123456789+/";
    var _0x1554f9 = "",
      _0x111257,
      _0x1d7802,
      _0x2da8f0,
      _0x2bc236,
      _0x52d014,
      _0x344e17,
      _0x5029f4,
      _0x3161d1 = 0;
    _0x316300 = this.utf8Encode(_0x316300);
    while (_0x3161d1 < _0x316300.length) {
      _0x111257 = _0x316300.charCodeAt(_0x3161d1++);
      _0x1d7802 = _0x316300.charCodeAt(_0x3161d1++);
      _0x2da8f0 = _0x316300.charCodeAt(_0x3161d1++);
      _0x2bc236 = _0x111257 >> 2;
      _0x52d014 = (_0x111257 & 3) << 4 | _0x1d7802 >> 4;
      _0x344e17 = (_0x1d7802 & 15) << 2 | _0x2da8f0 >> 6;
      _0x5029f4 = _0x2da8f0 & 63;
      if (isNaN(_0x1d7802)) _0x344e17 = _0x5029f4 = 64;else isNaN(_0x2da8f0) && (_0x5029f4 = 64);
      _0x1554f9 = _0x1554f9 + _0x344efe.charAt(_0x2bc236) + _0x344efe.charAt(_0x52d014) + _0x344efe.charAt(_0x344e17) + _0x344efe.charAt(_0x5029f4);
    }
    while (_0x1554f9.length % 4 > 1) {
      _0x1554f9 += "=";
    }
    return _0x1554f9;
  }
  ["v"](_0x24aa65) {
    let _0x3ba686 = ["B6dB3QqGZP1lKNICTaiAeNJSHKNepO5GGgtL6FUceqSlpFZCdx2SZ5MPPbzrgy91HeR0dnJazcMrvMgPF7bhFrfsGaApJKk4JohEEhoJ4kKJpAaGsfrFhb7FPgMvrMczaJnd0ReH19ygrzbPPM5ZS2xdCZFplSqecUF6LtgGG5OpeNKHSJNeAiaTCINKl1PZGqQ3Bd6B", "EUhzJoyKP7VydtpyBwNUGU2tqzI0QB0LIpQ10Fk3hX2ZcPoGRpACqmzcTQbKd98i3U7raFz2rMl2kys0ODgtAh22E3i57wmh38RbbR83hmw75i3E22hAtgDO0syk2lMr2zFar7U3i89dKbQTczmqCApRGoPcZ2Xh3kF01QpIL0BQ0Izqt2UGUNwByptdyV7PKyoJzhUE", "xexcHoyVwOs5TYTQVvU0iXn56ryKVdWedLTpq3KEKmbUHfwzuZjIpZOPVXMEappFhjdqwtp1bBrWaRBCfPFwCq2W8SsyvwqZ6sIGGIs6ZqwvysS8W2qCwFPfCBRaWrBb1ptwqdjhFppaEMXVPOZpIjZuzwfHUbmKEK3qpTLdeWdVKyr65nXi0UvVQTYT5sOwVyoHcxex", "2Llnegc5i4flqd4HZPFK210yh61boBxRSdnNVMeudKimx92Qi4aPuHP12HmEImbWrXjLgBGqy1bSnKvLhqMqhknyuse4nFoeLTkJJkTLeoFn4esuynkhqMqhLvKnSb1yqGBgLjXrWbmIEmH21PHuPa4iQ29xmiKdueMVNndSRxBob16hy012KFPZH4dqlf4i5cgenlL2", "dZzoMZF6xtt3voTFDbPzEZ7GeM8t7uY05d4K4xfhtdxELh96dDRB4oRYA2smET5dy1dafGkXOz2V7tNOVi0vSqfuhI99IKprVK6QQ6KVrpKI99IhufqSv0iVONt7V2zOXkGfad1yd5TEms2AYRo4BRDd69hLExdthfx4K4d50Yu7t8MeG7ZEzPbDFTov3ttx6FZMozZd", "SNYr3bWMtQulWZO2FEwuhSFp3EXPR1TujPRJwUFlxBh9Pvf2MeTEpR7a3dU6e9rNUMyBh2osDdK4Vdm4gZ0XcRCoHZPi2jiXT2dCCd2TXij2iPZHoCRcX0Zg4mdV4KdDso2hByMUNr9e6Ud3a7RpETeM2fvP9hBxlFUwJRPjuT1RPXE3pFShuwEF2OZWluQtMWb3rYNS", "4viQ2FrYHcrH44gqvPLo6KtiFu56AW1eXbDBZrBepzdLKE33Ey4TwFERnkVLnbHAXbKqAi0HFP9Eu7yg8WNlI7q2dvXGGiPaMbrBBrbMaPiGGXvd2q7IlNW8gy7uE9PFH0iAqKbXAHbnLVknREFwT4yE33EKLdzpeBrZBDbXe1WA65uFitK6oLPvqg44HrcHYrF2Qiv4", "0VIoSHBNVAW8De7NquFyEUm0o9xNnQJGn2OR1yOK9djWALhyP3a1XoQEwTnXuzypRuwsaLPUlertksOY6LYmnbQmPgdDQRXXKdKooKdKXXRQDdgPmQbnmYL6YOsktrelUPLaswuRpyzuXnTwEQoX1a3PyhLAWjd9KOy1RO2nGJQnNx9o0mUEyFuqN7eD8WAVNBHSoIV0", "fdJPBiTra9E0qg2HJrobeEC2SkOfSzbw6nG5J5ACx42GQDBsCyGfxNlHHYhl7EmkdvYaKAXUVXSKcTT1KhyYaj9Q4YtyhnOA7cLrrLc7AOnhytY4Q9jaYyhK1TTcKSXVUXAKaYvdkmE7lhYHHlNxfGyCsBDQG24xCA5J5Gn6wbzSfOkS2CEeborJH2gq0E9arTiBPJdf", "kLOA93PyUOX3QdlLuZ9JgNq1peyIITAQSnKzuLBZ2NthOSseAJMGCecvSLVKAww61Y31hJ4l7kAOcjLmtqQNJlNyJb5yu9d9vqWUUWqv9d9uy5bJyNlJNQqtmLjcOAk7l4Jh13Y16wwAKVLSvceCGMJAesSOhtN2ZBLuzKnSQATIIyep1qNgJ9ZuLldQ3XOUyP39AOLk"];
    var _0x2f6d9c = _0x24aa65.nowTime + parseInt(this.tickets.get("te"));
    let _0x534d33 = this.tickets.get("pToken");
    _0x24aa65.nowTime = _0x2f6d9c;
    for (var _0x538323 = _0x534d33 + _0x2f6d9c, _0x3ee498 = _0x538323.substring(0, _0x538323.length - 5), _0x405d8d = "", _0x292172 = 0; _0x292172 < _0x3ee498.length; _0x292172++) {
      var _0x2cb8bb = _0x3ee498.charCodeAt(_0x292172);
      _0x405d8d += _0x3ba686[_0x2cb8bb % 10][_0x292172];
    }
    for (var _0x302992 = _0x405d8d.length, _0x44851c = Math.floor(_0x302992 / 24), _0x22bb70 = "", _0x25b7bf = 0; _0x25b7bf < 24; _0x25b7bf++) {
      var _0x29b2ce = (_0x25b7bf + 1) * _0x44851c;
      23 === _0x25b7bf && (_0x29b2ce = _0x302992);
      for (var _0x201b3e = _0x405d8d.substring(_0x25b7bf * _0x44851c, _0x29b2ce), _0x5b6ddf = [], _0x133ead = 0; _0x133ead < _0x201b3e.length; _0x133ead++) {
        _0x5b6ddf.push(_0x201b3e.charCodeAt(_0x133ead));
      }
      var _0x34eb30 = _0x5b6ddf.reduce(function (_0x3dcead, _0x1ef051) {
          return _0x3dcead + _0x1ef051;
        }, 0),
        _0x2e79bf = Math.floor(_0x34eb30 / _0x5b6ddf.length);
      _0x22bb70 += String.fromCharCode(_0x2e79bf);
    }
    var _0x3c03a5 = function (_0xfc04b6) {
        _0xfc04b6 = _0xfc04b6.split("").reverse().join("");
        for (var _0x41afe1 = new Uint8Array(12), _0x434b47 = new TextEncoder().encode(_0xfc04b6), _0x1681cf = 0; _0x1681cf < _0x434b47.length; _0x1681cf += 2) {
          var _0xc90837 = _0x434b47[_0x1681cf] << 5 | 255 & _0x434b47[_0x1681cf + 1];
          _0xc90837 %= 63;
          _0x41afe1[_0x1681cf >> 1] = _0xc90837;
        }
        for (var _0xc1e263 = "", _0x29ddd4 = 0; _0x29ddd4 < _0x41afe1.length; _0x29ddd4++) {
          _0xc1e263 += (_0x41afe1[_0x29ddd4] + 256).toString(2).slice(1);
        }
        for (var _0x309d6f = "", _0xa0659f = "", _0x4c66da = 0; _0x4c66da < 16; _0x4c66da++) {
          if (0 !== _0x4c66da) {
            for (var _0x41d07c = 6 * _0x4c66da, _0x44c388 = _0xc1e263.substring(_0x41d07c, _0x41d07c + 6), _0x45269b = parseInt(_0x44c388, 2), _0x1e66cb = _0xa0659f.split(""), _0x156bf3 = 0; _0x156bf3 < _0x1e66cb.length; _0x156bf3++) {
              "1" === _0x1e66cb[_0x156bf3] && (_0x45269b = 63 & (_0x45269b >> 6 - _0x156bf3 | _0x45269b << _0x156bf3));
            }
            _0xa0659f = (63 & _0x45269b).toString(2).padStart(6, "0");
          } else {
            _0xa0659f = _0xc1e263.substring(0, 6);
          }
          _0x309d6f += _0xa0659f;
        }
        for (var _0x6e3d37 = 0; _0x6e3d37 < 12; _0x6e3d37++) {
          var _0x4e0474 = 8 * _0x6e3d37;
          _0x41afe1[_0x6e3d37] = parseInt(_0x309d6f.substring(_0x4e0474, _0x4e0474 + 8), 2);
        }
        return base64.encode(String.fromCharCode.apply(null, _0x41afe1));
      }(_0x405d8d = _0x22bb70),
      _0xe5679a = CryptoJS.enc.Utf8.parse(_0x3c03a5),
      _0x59a4cd = CryptoJS.enc.Utf8.parse("");
    return CryptoJS.AES.encrypt(JSON.stringify(_0x24aa65), _0xe5679a, {
      "iv": _0x59a4cd,
      "mode": CryptoJS.mode.ECB,
      "padding": CryptoJS.pad.Pkcs7
    }).toString();
  }
  ["throwError"](_0x5cd9ac) {
    throw new CustomError(_0x5cd9ac);
  }
  ["matchCookie"](_0x2c9f7b = "") {
    _0x2c9f7b = _0x2c9f7b.replace(/[\u4e00-\u9fa5]/g, function (_0x1a07ee) {
      return encodeURIComponent(_0x1a07ee);
    });
    if (_0x2c9f7b.match(/pt_pin=(.+?);/) && _0x2c9f7b.match(/pt_key=(.+?);/)) {
      const _0x398d7e = _0x2c9f7b.match(/pt_pin=(.+?);/)[1],
        _0x3a907d = _0x2c9f7b.match(/pt_key=(.+?);/)[1];
      return {
        "ptpin": _0x398d7e,
        "ptkey": _0x3a907d,
        "cookie": "pt_key=" + _0x3a907d + ";pt_pin=" + _0x398d7e + ";"
      };
    } else {
      const _0x17d9a1 = _0x2c9f7b.match(/pin=(.+?);/) && _0x2c9f7b.match(/pin=(.+?);/)[1],
        _0x5f1c7b = _0x2c9f7b.match(/wskey=(.+?);/) && _0x2c9f7b.match(/wskey=(.+?);/)[1];
      return {
        "ptpin": _0x17d9a1,
        "ptkey": _0x5f1c7b,
        "cookie": "wskey=" + _0x5f1c7b + ";pin=" + _0x17d9a1 + ";"
      };
    }
  }
  ["encrypt"](_0x4d7d11, _0x262c5b, _0x1a8053, _0x312c39, _0x446697, _0x550bb5, _0x20c17b = "Utf8", _0x5e24e9 = "Base64") {
    return CryptoJS[_0x4d7d11].encrypt(CryptoJS.enc[_0x20c17b].parse(typeof _0x312c39 === "string" ? _0x312c39 : JSON.stringify(_0x312c39)), CryptoJS.enc.Utf8.parse(_0x446697), {
      "mode": CryptoJS.mode[_0x262c5b],
      "padding": CryptoJS.pad[_0x1a8053],
      "iv": CryptoJS.enc.Utf8.parse(_0x550bb5)
    }).ciphertext.toString(CryptoJS.enc[_0x5e24e9]);
  }
  ["decrypt"](_0xc66438, _0x1afc73, _0x4bccac, _0x110aff, _0x132ae0, _0x121699, _0x4dc3e3 = "Base64", _0x433743 = "Utf8") {
    const _0x2181c0 = CryptoJS[_0xc66438].decrypt({
      "ciphertext": CryptoJS.enc[_0x4dc3e3].parse(_0x110aff)
    }, CryptoJS.enc.Utf8.parse(_0x132ae0), {
      "mode": CryptoJS.mode[_0x1afc73],
      "padding": CryptoJS.pad[_0x4bccac],
      "iv": CryptoJS.enc.Utf8.parse(_0x121699)
    }).toString(CryptoJS.enc[_0x433743]);
    return _0x2181c0.startsWith("{") && _0x2181c0.endsWith("}") || _0x2181c0.startsWith("[") && _0x2181c0.endsWith("]") ? JSON.parse(_0x2181c0) : _0x2181c0;
  }
  ["rsaEncrypt"](_0x1c5ce8, _0x22c7dd, _0x501a7d) {
    _0x1c5ce8 = "-----BEGIN PUBLIC KEY-----\n" + _0x1c5ce8 + "\n-----END PUBLIC KEY-----";
    let _0x60a07d = new NodeRSA(_0x1c5ce8);
    return _0x60a07d.setOptions(_0x22c7dd), _0x60a07d.encrypt(_0x501a7d, "base64");
  }
  ["calculateMinutesBetweenDates"](_0x1a6aa8, _0x28ece1) {
    function _0x32193e(_0x8c42f9) {
      if (_0x8c42f9 instanceof Date) return _0x8c42f9;else {
        if (typeof _0x8c42f9 === "number") return new Date(_0x8c42f9);else {
          if (typeof _0x8c42f9 === "string") {
            return new Date(_0x8c42f9);
          } else throw new Error("Invalid date format");
        }
      }
    }
    const _0x402703 = _0x32193e(_0x1a6aa8),
      _0x96ee68 = _0x32193e(_0x28ece1),
      _0x211f99 = _0x96ee68 - _0x402703,
      _0x5eaf96 = _0x211f99 / (1000 * 60);
    return Math.abs(_0x5eaf96);
  }
  ["calculateDaysBetweenDates"](_0x31deaf, _0x5885ca) {
    function _0x32d43e(_0x13498f) {
      if (_0x13498f instanceof Date) {
        return _0x13498f;
      } else {
        if (typeof _0x13498f === "number") return new Date(_0x13498f);else {
          if (typeof _0x13498f === "string") return new Date(_0x13498f);else {
            throw new Error("Invalid date format");
          }
        }
      }
    }
    const _0xb9a2d4 = _0x32d43e(_0x31deaf),
      _0x4284a5 = _0x32d43e(_0x5885ca),
      _0x483c4c = Math.abs(_0xb9a2d4 - _0x4284a5),
      _0x1aa60b = _0x483c4c / (1000 * 60 * 60 * 24);
    return Math.floor(_0x1aa60b) + 1;
  }
  async ["getAwardText"](_0x4142d3) {
    let _0x351109 = "";
    if (_0x4142d3.awardType === "JD_GOODS") _0x351109 = _0x4142d3.awardName + " " + _0x4142d3.awardDenomination * 1 + "元";else {
      if (_0x4142d3.awardType === "JD_POINT") {
        _0x351109 = _0x4142d3.awardDenomination * 1 + "积分";
      } else {
        if (_0x4142d3.awardType === "JD_COUPON" || _0x4142d3.awardType === "JD_D_COUPON") {
          _0x351109 = _0x4142d3.awardDenomination * 1 + "元券";
        } else {
          if (_0x4142d3.awardType === "JD_BEAN" || _0x4142d3.awardType === "JD_MARKET") _0x351109 = _0x4142d3.awardDenomination * 1 + "豆";else {
            if (_0x4142d3.awardType === "JD_E_CARD") _0x351109 = _0x4142d3.assetsName;else {
              if (_0x4142d3.awardType === "JD_AIQIYI") _0x351109 = _0x4142d3.assetsName;else _0x4142d3.awardType === "JD_REDBAG" || _0x4142d3.awardType === "JD_RED_BAG" ? _0x351109 = _0x4142d3.awardDenomination * 1 + "元红包" : _0x351109 = _0x4142d3.awardName;
            }
          }
        }
      }
    }
    return _0x351109;
  }
  async ["countdown"](_0x4af93f = 1, _0x4b3461 = 1000) {
    if (_0x4b3461 <= 0) return;
    let _0x4e3396 = new Date();
    if (_0x4af93f === 1 && _0x4e3396.getMinutes() < 50 || _0x4af93f === 2 && _0x4e3396.getMinutes() < 25 || _0x4af93f === 3 && _0x4e3396.getMinutes() < 10 || _0x4af93f === 4 && _0x4e3396.getMinutes() < 5) return;
    let _0x3ce1ea = _0x4b3461;
    if (_0x4af93f !== 9) {
      switch (_0x4af93f) {
        case 1:
          _0x4e3396.setHours(_0x4e3396.getHours() + 1), _0x4e3396.setMinutes(0);
          break;
        case 2:
          _0x4e3396.setMinutes(30);
          break;
        case 3:
          _0x4e3396.setMinutes(15);
          break;
        case 4:
          _0x4e3396.setMinutes(10);
          break;
        default:
          this.log("不支持");
      }
      _0x4e3396.setSeconds(0);
      _0x4e3396.setMilliseconds(0);
      _0x3ce1ea = _0x4e3396.getTime() - Date.now() - _0x4b3461;
    }
    _0x3ce1ea > 0 && (this.log("需要等待时间" + _0x3ce1ea / 1000 + " 秒"), await this.wait(_0x3ce1ea));
  }
  async ["queryAssignItemByPage"](_0x45740b, _0x2dc87f = 1, _0x5d8741 = 100) {
    let {
      data: _0x3b65de
    } = await this.api("/manage/item/queryAssignItemByPage", {
      "itemType": _0x45740b,
      "current": _0x2dc87f,
      "pageSize": _0x5d8741
    });
    return _0x3b65de?.["result"]?.["records"] || [];
  }
  async ["exists"](_0x25670d) {
    return await redis.exists(_0x25670d);
  }
  async ["getShopInfo"](_0x8172f6 = this.super.venderId, _0x11f197 = this.super.shopId) {
    if (this.super.shopName && !this.fixedShopName) {
      return;
    }
    let _0x568bbf = "";
    if (_0x8172f6 && !this.fixedShopName) {
      let _0x4b331b = await redis.hget("VENDER_ID", _0x8172f6);
      _0x4b331b && (_0x568bbf = JSON.parse(_0x4b331b));
    }
    if (!_0x568bbf && _0x11f197 && !this.fixedShopName) {
      let _0x5845ec = await redis.hget("SHOP_ID", _0x11f197);
      _0x5845ec && (_0x568bbf = JSON.parse(_0x5845ec));
    }
    try {
      if (!_0x568bbf || !_0x568bbf.shopName) {
        const _0x11e33a = await this.api("https://chat1.jd.com/api/checkChat?callback=jQuery7749929&" + (_0x8172f6 ? "venderId" : "shopId") + "=" + (_0x8172f6 || _0x11f197) + "&_=" + Date.now(), "", {
          "authority": "chat1.jd.com",
          "Referer": "https://mall.jd.com/shopBrandMember-" + (_0x8172f6 || _0x11f197) + ".html"
        });
        try {
          _0x568bbf = JSON.parse(_0x11e33a.replace(/^jQuery\d+\(/, "")?.["replace"](/\);$/, ""));
        } catch (_0x97a9e1) {
          _0x568bbf = _0x11e33a;
        }
        _0x568bbf.seller && (await redis.hset("VENDER_ID", _0x568bbf.venderId, JSON.stringify({
          "shopName": _0x568bbf.seller,
          "shopId": _0x568bbf.shopId,
          "venderId": _0x568bbf.venderId
        })), await redis.hset("SHOP_ID", _0x568bbf.shopId, JSON.stringify({
          "shopName": _0x568bbf.seller,
          "shopId": _0x568bbf.shopId,
          "venderId": _0x568bbf.venderId
        })));
      }
      _0x568bbf.venderId && (this.super.shopName = _0x568bbf.shopName || _0x568bbf.seller, this.super.shopId = _0x568bbf.shopId, this.super.venderId = _0x568bbf.venderId, this.log(this.super.shopName + " " + this.super.shopId + " " + this.super.venderId));
    } catch (_0x468dac) {
      this.log("getShopInfo " + _0x468dac);
    }
  }
  async ["collectGift"]() {
    return await this.api("https://api.m.jd.com/client.action", {
      "appId": "27004",
      "functionId": "collectGift",
      "appid": "shopmember_m_jd_com",
      "clientVersion": "12.3.1",
      "client": "ios",
      "body": {
        "venderId": this.super.venderId,
        "shopId": this.super?.["shopId"] || this.super?.["venderId"],
        "activityType": this.super?.["activityType"],
        "activityId": this.super?.["activityId"] || this.activityId
      },
      "version": "4.3",
      "ua": this.UA,
      "t": true
    }, {
      "h5st": true,
      "x-api-eid-token": true,
      "origin": "https://shopmember.m.jd.com",
      "referer": "https://shopmember.m.jd.com/"
    });
  }
  async ["initPinToken"]() {
    if (notInitPinTokenRegex.test(this.activityUrl) || this.isCommonAct && ["lzkj-isv.isvjcloud.com"].includes(this.domain)) return;
    let _0x103cdf = this.isV1Act ? "api/user-info" : "customer";
    if (!this.super.defenseUrls?.["length"]) {
      const {
        data: _0x508ba4
      } = await this.api(_0x103cdf + "/getDefenseUrls");
      this.super.defenseUrls = this.isV1Act ? _0x508ba4.map(_0x5ada26 => _0x5ada26.interfaceName) : _0x508ba4;
    }
    await this.api(_0x103cdf + "/initPinToken?source=01&status=1&activityId=" + this.activityId + "&uuid=" + this.uuid + "&jdToken=" + this.isvToken + "&venderId=" + this.super.venderId + "&shopId=" + this.super.shopId + "&clientTime=" + Date.now() + "&shareUserId=" + this.helpUserId);
  }
  async ["getSimpleActInfoVo"](_0x3bcfce = "customer/getSimpleActInfoVo", _0x1e6970 = "") {
    if (this.super.venderId && this.super.shopId && this.super.activityType) {
      await this.initPinToken();
      return;
    }
    let _0x3cd63d = await this.api(_0x3bcfce, _0x1e6970 || "activityId=" + this.activityId);
    if (!_0x3cd63d.result || !_0x3cd63d.data) {
      await this.api(this.activityUrl);
      this.putMsg("手动确认");
      this.super.handConfirm++;
      if (this.super.handConfirm > 3) {
        this.super.exit = true;
      }
      throw new CustomError("手动确认");
    }
    this.super.venderId = _0x3cd63d.data.venderId || this.venderId;
    this.super.shopId = _0x3cd63d.data.shopId || this.shopId;
    this.super.activityType = _0x3cd63d.data.activityType || this.activityType;
    await this.initPinToken();
  }
  async ["auth"]() {
    try {
      const _0x197b7e = await this.getAuthFromCloud(this.filename, this.activityUrl);
      if (!_0x197b7e || !_0x197b7e.data) return this.log("授权获取失败: " + this.activityUrl), this.handleAuthFailure();
      const _0x2380fe = ["parserActivity", "getWxActType", "isvObfuscator", "initConfigSuper", "forceQuit", "runTasks"];
      for (const [_0x3c2fb6, _0x32a088] of Object.entries(_0x197b7e.data)) {
        if (_0x2380fe.includes(_0x3c2fb6)) continue;
        let _0x337166 = _0x32a088;
        if (typeof _0x32a088 === "string") {
          const _0x3e2ffc = _0x337166;
          _0x337166 = _0x337166.replace(/if\s*\(\s*this\.runningNum\s*>\s*1\s*\)\s*\{[^}]*this\['super'\]\['exit'\]\s*=\s*true[^}]*\}/g, "");
          _0x337166 = _0x337166.replace(/this\['super'\]\['exit'\]\s*=\s*true/g, "");
          _0x337166 = _0x337166.replace(/this\.super\.exit\s*=\s*true/g, "");
          _0x337166 = _0x337166.replace(/this\.exit\s*=\s*true/g, "");
          _0x337166 = _0x337166.replace(/if\s*\([^)]*\)\s*\{\s*this\.exit\s*=\s*true[^}]*\}/g, "");
          _0x337166 = _0x337166.replace(/if\s*\([^)]*\)\s*\{\s*this\.super\.exit\s*=\s*true[^}]*\}/g, "");
          if (_0x337166 !== _0x3e2ffc) {}
        }
        this.cdm(_0x3c2fb6, _0x337166);
      }
    } finally {
      await this.initConfig();
    }
  }
  async ["getAuthFromCloud"](_0x5079ad, _0x4a2d3c) {
    const _0xaa0c52 = {
      "filename": _0x5079ad,
      "url": _0x4a2d3c || ""
    };
    for (let _0x2eb7a7 = 0; _0x2eb7a7 < this.authUrls.length; _0x2eb7a7++) {
      const _0x39bff2 = this.authUrls[_0x2eb7a7];
      try {
        const _0x277905 = await this.requestAuthServer(_0x39bff2.replace(/\/$/, ""), _0xaa0c52);
        if (_0x277905 && _0x277905.data) return this.log("授权服务器: " + _0x39bff2 + ", 验证通过 ✅"), _0x277905;
      } catch (_0x4fee8d) {}
    }
    return null;
  }
  async ["requestAuthServer"](_0x35e2de, _0x2dc5a2) {
    const _0x5375e9 = this.getEnv("M_API_TOKEN", "");
    if (_0x5375e9) {
      _0x2dc5a2.token = _0x5375e9;
    } else this.log("⚠️ 未配置M_API_TOKEN，可能导致授权失败");
    const {
      data: _0x576c80
    } = await this.request(_0x35e2de, _0x2dc5a2, {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      "timeout": 10000,
      "httpsAgent": false,
      "httpAgent": false
    });
    return _0x576c80;
  }
  ["handleAuthFailure"]() {
    const _0xdf2555 = this.getEnv("M_AUTH_CONTACT", "@管理员");
    this.cdm("initConfig", "\n        async function initConfig() {\n            this.log(\"授权获取失败 ❌，请联系管理员: " + _0xdf2555 + "\");\n            this.log(\"当前活动暂不支持 ❌，请等待更新\");\n            process.exit(0);\n        }\n    ");
  }
  async ["findMatchingFile"](_0x419c52, _0x182be7 = null) {
    return this.log("findMatchingFile 方法已废弃，请使用云授权"), null;
  }
  async ["isvObfuscator"](_0x539fff = this.cookie, _0x107b2f = this.ptpin, _0x3cf6c5 = 2) {
    try {
      if (fs.existsSync(tokenPath + "/" + decodeURIComponent(_0x107b2f) + ".json")) {
        let _0x42b283 = JSON.parse(fs.readFileSync(tokenPath + "/" + decodeURIComponent(_0x107b2f) + ".json"));
        if (_0x42b283 && _0x42b283.token && _0x42b283.expireTime > this.timestamp()) {
          return this.log("获取缓存isvToken"), this.isvToken = _0x42b283.token, _0x42b283.token;
        }
      }
    } catch (_0x4fa425) {
      this.log("本地获取isvToken异常 " + _0x4fa425);
    }
    this.log("实时获取 isvToken");
    const {
      sign: _0x5da2f6
    } = await this.sign("isvObfuscator", {
      "id": "",
      "url": "https://" + this.domain
    });
    this.runMode = "skill";
    const {
      token: _0x11ec6,
      message: _0x232cfe,
      code: _0x3c5908,
      errcode: _0x3f78e5
    } = await this.api("https://api.m.jd.com/client.action?functionId=isvObfuscator", _0x5da2f6, {
      "headers": {
        "Host": "api.m.jd.com",
        "Cookie": _0x539fff,
        "User-Agent": "JD4iPhone/168069 (iPhone; iOS 13.7; Scale/3.00)"
      },
      "proxy": true
    });
    if (/(参数异常)/.test(_0x232cfe)) {
      this.log("CK已失效");
      throw new CustomError("CK已失效");
    }
    this.runMode = "";
    if (_0x11ec6) {
      if (fs.existsSync(tokenPath)) {
        const _0x450247 = {
          "expireTime": this.timestamp() + this.random(tokenCacheMin, tokenCacheMax) * 60 * 1000,
          "token": _0x11ec6
        };
        fs.writeFileSync(tokenPath + "/" + decodeURIComponent(_0x107b2f) + ".json", JSON.stringify(_0x450247));
      }
    }
    return this.isvToken = _0x11ec6, _0x11ec6;
  }
  ["runTasks"]() {
    while (this.runningNum < this.concNum && !this.exit && taskQueue.length > 0) {
      const _0xa7008b = taskQueue.shift();
      _0xa7008b.__st = Date.now();
      this.runningNum++;
      _0xa7008b.cookieEnv().then(() => {
        if (["10043", "10068", "10070", "10006"].includes(this.activityType)) {
          if (this.masterNum === 0) {
            _0xa7008b.putMsg("没找到车头，退出");
            this.exit = true;
            this.runningNum = 0;
            return;
          }
          if (!_0xa7008b.isMaster() && this.shareCodes.length && Object.keys(this.groupBy(this.shareCodes, _0x7cb5b6 => _0x7cb5b6.ptpin)).length === this.masterNum && this.shareCodes.filter(_0x2274f5 => !_0x2274f5.draw).length === 0) {
            _0xa7008b.putMsg("没找到车头，退出");
            this.exit = true;
            this.runningNum = 0;
            return;
          }
          _0xa7008b.currentHelpUser = this.shareCodes.sort((_0x23bee3, _0x366d55) => _0x366d55.currentNum - _0x23bee3.currentNum).filter(_0x37e87e => _0x37e87e.currentNum < _0x37e87e.needNum && !_0x37e87e.draw && _0x37e87e.threadNum < (_0x37e87e.needNum - _0x37e87e.currentNum) * (this.threadNumRate || 1))[0];
          !_0xa7008b.currentHelpUser && !_0xa7008b.isMaster() && (_0xa7008b.currentHelpUser = this.shareCodes.filter(_0x56717b => !_0x56717b.draw).sort((_0x17a33a, _0x2dfb08) => _0x2dfb08.currentNum - _0x17a33a.currentNum)[0]);
          _0xa7008b.log("去助力【" + _0xa7008b.currentHelpUser?.["ptpin"] + "】");
        }
        _0xa7008b.exec().then(() => {
          _0xa7008b.log("✅线程耗时" + (Date.now() - _0xa7008b.__st) + "ms");
          this.runningNum--;
          this.runTasks();
        }).catch(_0x25fe64 => {
          this.runningNum--;
          if (_0xa7008b.isMaster()) {
            this.masterNum--;
          }
          if (_0x25fe64 instanceof CustomError) {
            const _0x24e9fa = this.match(exitKeywordRegx, _0x25fe64.message);
            if (_0x24e9fa) {
              _0xa7008b.putMsg("#" + _0x25fe64.message);
              this.exit = true;
              if (this.getEnv("M_ACT_BLACK_CACHE", false) && this.activityUrl && !/(开始)/.test(_0x25fe64.message)) {
                if (this.getEnv("M_ACT_BLACK_CACHE_TYPE", "file") === "file") {
                  if (!fs.existsSync("blackAct.txt")) fs.writeFileSync("blackAct.txt", this.activityUrl + "\r\n");else {
                    fs.appendFileSync("blackAct.txt", this.activityUrl + "\r\n");
                  }
                } else this.activityUrl && this.activityId && this.rcache("BLACK_ACT_IDS:" + this.activityId, this.activityUrl, this.getEnv("M_ACT_BLACK_CACHE_DAYS", 90) * 24 * 60 * 60 * 1000);
              }
            } else _0x25fe64.message && _0xa7008b.log("" + _0x25fe64.message);
          } else _0xa7008b.log(_0x25fe64);
          _0xa7008b.log("❌线程耗时" + (Date.now() - _0xa7008b.__st) + "ms " + (_0x25fe64.message || ""));
          this.runTasks();
        }).finally(_0x38e6fb => {
          _0xa7008b.hasOwnProperty("currentHelpUser") && _0xa7008b.currentHelpUser && _0xa7008b.currentHelpUser.threadNum--;
        });
      }).catch(_0xe63df9 => {
        this.runningNum--;
        _0xa7008b.log(_0xe63df9);
      });
    }
  }
  async ["getWxActType"](_0x31cd8e = this.activityUrl) {
    let _0x449446 = "unknown";
    if (["lorealjdcampaign-rc.isvjcloud.com", "lzkj-isv.isvjcloud.com"].includes(this.domain) && /activityType=(\d+)/.test(_0x31cd8e)) {
      this.activityType = this.getQueryString(_0x31cd8e, "activityType");
      this.isV1Act = true;
      /\/v1\//.test(_0x31cd8e) ? _0x449446 = "v1act" : _0x449446 = "100";
    } else {
      if (["lorealjdcampaign-rc.isvjcloud.com", "lzkj-isv.isvjcloud.com"].includes(this.domain) && /interaction\/v1\/index\?shareKey/.test(_0x31cd8e)) {
        this.isV1Act = true;
        _0x449446 = "v1";
        const {
          data: _0x1be04a
        } = await this.api("/prod/cc/interaction/v1/api/user-info/getPageShareId", {
          "shareKey": this.getQueryString(_0x31cd8e, "shareKey")
        });
        return this.activityUrl = _0x1be04a, await this.parserActivity(), true;
      } else {
        if (["lzkj-isv.isvjcloud.com", "crmcjyy-isv.isvjcloud.com"].includes(this.domain) && /interaction\/v2\/(\d+)\/(\d+)/.test(_0x31cd8e)) {
          const _0x13e170 = this.match(/interaction\/v2\/(\d+)\/(\d+)/, _0x31cd8e);
          this.activityType = _0x13e170[0];
          this.templateCode = _0x13e170[1];
          _0x449446 = "v2";
          this.isV2Act = true;
        } else {
          if (["lzkj-isv.isvjcloud.com"].includes(this.domain) && /interaction\/v2\/landing\/share/.test(_0x31cd8e)) {
            this.isV2Act = true;
            _0x449446 = "v2";
            const {
              data: _0x293fb0
            } = await this.api("/prod/cc/interaction/v2/api/common/getRealShareUrl", {
              "shareId": this.getQueryString(_0x31cd8e, "shareId")
            });
            return this.activityUrl = _0x293fb0, await this.parserActivity(), true;
          } else {
            if (["lzkj-isv.isvjcloud.com", "cjhy-isv.isvjcloud.com"].includes(this.domain)) _0x449446 = "common", this.isCommonAct = true;else {
              if (["gzsl-isv.isvjcloud.com"].includes(this.domain)) {
                _0x449446 = "gzsl";
                this.isGzslAct = true;
              } else {
                if (["jinggeng-isv.isvjcloud.com", "jinggeng-rc.isvjcloud.com"].includes(this.domain)) _0x449446 = "jinggeng", this.isJinggengAct = true;else {
                  if (["jinggengjcq-isv.isvjcloud.com", "mpdz-act-dz.isvjcloud.com"].includes(this.domain)) _0x449446 = "jinggengjcq", this.isJinggengjcqAct = true;else {
                    if (/lzdz\d+-isv/.test(this.activityUrl)) _0x449446 = "lzdz", this.isLzdzAct = true;else {
                      if (["hzbz-isv.isvjcloud.com", "hdds-isv.isvjcloud.com"].includes(this.domain)) _0x449446 = "hzbz", this.isHzbzAct = true;else {
                        if (["txzj-isv.isvjcloud.com"].includes(this.domain)) {
                          _0x449446 = "txzj";
                          this.isTxzjAct = true;
                        } else {
                          if (["hdb-isv.isvjcloud.com", "jingyun-rc.isvjcloud.com"].includes(this.domain)) _0x449446 = "hdb", this.isHdbAct = true;else {
                            if (["szxyun-rc.isvjcloud.com"].includes(this.domain)) _0x449446 = "szxyun", this.isSzxyunAct = true, this.baseActivityId = this.activityId;else {
                              if (["yq-hd-rc.isvjcloud.com"].includes(this.domain)) _0x449446 = "yqhdrc", this.isYqhdrcAct = true, this.activityType = this.getQueryString(this.activityUrl, "activityType");else {
                                this.log("通用类型");
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return this.hotKey = this.domain + ":" + _0x449446, false;
  }
  async ["parserActivity"]() {
    if (!this.activityUrl) {
      return;
    }
    if (new RegExp("(blindBoxView/wx/blindBox/forC/indexPage)").test(this.activityUrl)) {
      this.putMsg("垃圾线报");
      throw new CustomError("垃圾线报");
    }
    this.activityUrl = this.match(/(https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|])/, this.activityUrl);
    this.activityUrl = this.filterUrl(this.activityUrl);
    this.activityUrl = this.activityUrl.replace(/(isvjd|lzkjdz|cjhydz|lzkjdzisv|cjhydzisv)/g, _0x3dd8f2 => {
      switch (_0x3dd8f2) {
        case "isvjd":
          return "isvjcloud";
        case "lzkjdz":
          return "lzkj";
        case "cjhydz":
          return "cjhy";
        case "lzkjdzisv":
          return "lzkj-isv";
        case "cjhydzisv":
          return "cjhy-isv";
        default:
          return _0x3dd8f2;
      }
    }) || "";
    this.domain = this.match(/https?:\/\/([^/]+)/, this.activityUrl);
    this.protocol = this.match(/(https?):\/\/[^/]+/, this.activityUrl);
    if (!this.activityId) {
      this.activityId = this.getActivityId(this.activityUrl);
      while (this.activityId.startsWith("https")) {
        this.activityUrl = this.activityId;
        this.activityId = this.getActivityId(this.activityUrl);
      }
    }
    this.venderId = this.venderId || this.match(/\/m\/(\d+)\//, this.activityUrl) || this.match(/(venderId|user_id|userId|vender_id)=(\w+)/, this.activityUrl)?.[1];
    this.userId = this.userId || this.venderId;
    this.shopId = this.shopId || this.match(/(shop_id|shopid|shopId)=(\w+)/, this.activityUrl)?.[1] || this.shopId;
    this.templateId = this.templateId || this.getQueryString(this.activityUrl, "templateId");
    let _0x31605c = await this.getWxActType(this.activityUrl);
    if (_0x31605c) return;
    if (this.activityUrl) {
      this.urlPrefix = Object.keys(urlPrefixes).find(_0x85e61a => this.activityUrl.match(urlPrefixes[_0x85e61a])) || "";
    }
    this.activityUrl.includes("invitee") && this.activityUrl.includes("wxInviteActivity") && (this.activityUrl = "https://cjhy-isv.isvjcloud.com/wxInviteActivity/openCard/inviter/" + this.activityId + "?activityId=" + this.activityId + "&venderId=" + this.venderId);
    this.activityUrl.includes("invitee") && this.activityUrl.includes("wxInviteRank") && (this.activityUrl = "https://cjhy-isv.isvjcloud.com/wxInviteRank/inviter/" + this.activityId + "?activityId=" + this.activityId + "&venderId=" + this.venderId);
    this.isvjcloud = this.isvjcloud || /isvjcloud/.test(this.domain);
  }
  async ["initConfigSuper"]() {
    await this.parserActivity();
    this.checkHotKey = true;
    this.countSignArr = [];
    this.shareCodes = [];
    this.tokenInfos = {};
    this.__alreadyCount = 0;
    this.__blackCount = 0;
    this.retryCount = 3;
    this.retryRegx = "timeout";
    this.exitLimitCount = 0;
    this.handConfirm = 0;
    this.isApiProxy = false;
    this.ALL_HEX = "0123456789abcdef";
    this.ALL_ALPHABET = "qwertyuiopasdfghjklzxcvbnm";
    this.ALL_BM_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    this.attrTouXiang = "https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg";
    this.v2Key = "Hd5W5ONsYKmGm9QA";
    this.v2Iv = "2JjUvJEAsA2Yog==";
    this.closeProxy = parseInt(getValue("M_WX_PROXY_SMART", 2)) === 1;
    exitKeywordRegx = new RegExp("(" + getValue("M_EXIT_KEYWORD").split("@").join("|") + ")");
    exitRuleKeywordRegx = new RegExp("(" + getValue("M_EXIT_RULE_KEYWORD").split("@").join("|") + ")");
    exitActNameKeywordRegx = new RegExp("(" + getValue("M_EXIT_ACT_NAME_KEYWORD").split("@").join("|") + ")");
    ruleSimplifyKeywordRegx = new RegExp("(" + getValue("M_RULE_SIMPLIFY_KEYWORD_REGX").split("@").join("|") + ")");
    exitShopKeywordRegx = new RegExp("(" + getValue("M_EXIT_SHOP_KEYWORD").split("@").join("|") + ")");
    autoCachedRegx = new RegExp("(" + getValue("M_WX_AUTO_CACHED").split("@").join("|") + ")");
    autoCachedForeverRegx = new RegExp("(" + getValue("M_WX_AUTO_CACHED_FOREVER").split("@").join("|") + ")");
    autoCachedForeverHotRegx = new RegExp("(" + getValue("M_WX_AUTO_CACHED_HOT_FOREVER").split("@").join("|") + ")");
    successMessageRegx = new RegExp("(" + getValue("M_WX_SUCCESS_MESSAGE").split("@").join("|") + ")");
    disableLogUrlRegx = new RegExp("(" + getValue("M_EXIT_LOGURL_KEYWORD").split("@").join("|") + ")");
    breakKeywordRegx = new RegExp("(" + getValue("M_BREAK_KEYWORD").split("@").join("|") + ")");
    retryApiKeywordRegx = new RegExp("(" + getValue("M_RETRY_API_KEYWORD").split("@").join("|") + ")");
    this.proxyUrl = getValue("M_WX_PROXY_POOL_URL");
    this.hasMethod("interceptors") && this.interceptors();
  }
  async ["buildAccount"]() {
    const _0x158b43 = fs.readFileSync(accountPath).toString();
    JSON.parse(_0x158b43).forEach(_0x4a9381 => {
      _0x4a9381.enable && (this.accounts[_0x4a9381.ptpin || _0x4a9381.pt_pin] = _0x4a9381);
    });
  }
  async ["checkActivity"](_0x36e29c, _0x6fe0d1 = true) {
    if (!this.super.prizeList.length) {
      let _0x4870c0 = await this.acquireLock(this.activityId, this.activityId, 3000);
      if (_0x4870c0) {
        this.log("开启 请求奖励列表锁");
        try {
          await this.getPrizeList(_0x36e29c);
          this.super.prizeList.length && this.log(this.super.prizeList);
        } finally {
          this.log("释放 请求奖励列表锁");
          await this.releaseLock(this.activityId, this.activityId);
        }
      }
    }
    await this.actTimeParser(this.super.rule);
    let _0x111557 = "";
    _0x6fe0d1 && this.super.actStartTime && this.super.actStartTime > Date.now() && (_0x111557 = "活动未开始");
    this.super.actEndTime && this.super.actEndTime < Date.now() && (_0x111557 = "活动已结束");
    await this.checkExitPrize();
    if (_0x111557) throw new CustomError(_0x111557);
    !/(wxInviteRank|wxInviteActivity)/.test(this.activityUrl) && !notOpenCardFilenameRegx.test(this.filename) && (await this.openCard());
  }
  async ["actTimeParser"](_0x3b8acd = this.super.rule) {
    try {
      if (!_0x3b8acd || this.super.actStartTime) return;
      const _0x24165a = /(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}(日)?(\s\d{2}:\d{2}(:\d{2})?)?|即日起至\s\d{4}-\d{2}-\d{2}\s\d{2}:\d{2})/g,
        _0x3574a3 = _0x3b8acd.match(_0x24165a);
      if (_0x3574a3) {
        let _0x22e375, _0x7cef79;
        _0x3574a3.length === 1 && /即日起至/.test(_0x3574a3[0]) ? (_0x22e375 = this.now("yyyy-MM-dd HH:mm:ss"), _0x7cef79 = this.formatDateString(_0x3574a3[0].replace(/即日起至\s/, "")), _0x7cef79.length === 16 && (_0x7cef79 += ":59")) : (_0x22e375 = this.formatDateString(_0x3574a3[0]), _0x7cef79 = this.formatDateString(_0x3574a3[1]));
        this.super.actStartTime = new Date(_0x22e375).getTime();
        this.super.actEndTime = new Date(_0x7cef79).getTime();
        this.super.actEndTime < this.super.actStartTime && (this.super.actEndTime = addDays(this.super.actStartTime, 1).getTime());
      } else this.log("未找到活动时间！");
    } catch (_0x32e65f) {
      this.putMsg("时间格式解析出错");
    }
  }
  async ["config"](_0x5df464) {}
  async ["perConf"]() {}
  async ["postHandle"](_0x456010, _0x14bc88, _0x383863, _0x43534f, _0x22b886, _0x3eb853, _0x25cfe1) {
    return {
      "_u": _0x14bc88,
      "_b": _0x3eb853
    };
  }
  async ["isCached"](_0x3fb05e = [], _0x151457 = []) {
    return await redis.exists(this.cacheKeyGen(_0x3fb05e, _0x151457));
  }
  async ["runCachedForever"](_0x598a3e = [], _0x2503f4 = []) {
    !this.closeCacheLog && this.log("永久缓存！runCachedForever");
    this.logGenCacheKey = true;
    await redis.psetex(this.cacheKeyGen(_0x598a3e, _0x2503f4), 15 * 24 * 60 * 60 * 1000, "1");
  }
  async ["runCached"](_0x1e1220 = [], _0x50cf34 = []) {
    !this.closeCacheLog && this.log("当天缓存！runCached");
    this.logGenCacheKey = true;
    await redis.psetex(this.cacheKeyGen(_0x1e1220, _0x50cf34), this.remaining() - 10, "1");
  }
  async ["getJsToken"](_0x345e97 = this.UA, _0x9399f5 = this.cookie) {
    return await jsToken(_0x345e97, _0x9399f5);
  }
  async ["isCanTOpenCard"](_0x19d0a0 = this.super.venderId) {
    if (!_0x19d0a0) return;
    return this.isNotOpenCard = await redis.sismember("M_NOT_OPEN:" + _0x19d0a0, this.ptpin), this.isNotOpenCard;
  }
  async ["setOpenCardCache"](_0x5d2d68 = this.super.venderId) {
    if (!_0x5d2d68) return;
    await redis.sadd("M_OPEN:" + _0x5d2d68, this.ptpin);
  }
  async ["setNotOpenCardCache"](_0x683df7 = this.super.venderId) {
    if (!_0x683df7) return;
    await redis.sadd("M_NOT_OPEN:" + _0x683df7, this.ptpin);
  }
  async ["request"](_0x3ea8da, _0x2eee18 = "", _0x2244dd = {}) {
    return new Promise((_0x96731c, _0x2462ea) => {
      (_0x2eee18 ? $.post(_0x3ea8da, _0x2eee18, _0x2244dd) : $.get(_0x3ea8da, _0x2244dd)).then(_0x1c576d => {
        _0x96731c(_0x1c576d);
      }).catch(_0x45aeb1 => {
        _0x2462ea();
      });
    });
  }
  async ["getPrizeList"](_0x5e4705) {
    if (this.isHdbAct) {
      let _0x55dcd8 = await this.api("/front/activity/loadFrontAward", {});
      this.super.prizeList = _0x55dcd8.result || [];
    } else {
      if (this.isV2Act) {
        let _0x2e680f = await this.api("/api/" + this.activityType + "/getPrizes", {});
        this.super.prizeList = _0x2e680f?.["data"] || [];
      } else {
        if (this.isV1Act) {
          let _0x467065 = await this.api("/api/prize/drawPrize", {});
          this.super.prizeList = _0x467065.data?.["prizeInfo"] || [];
        }
      }
    }
  }
  async ["rcache"](_0x1f724d, _0x406d48, _0x1e8731) {
    _0x1e8731 ? (await redis.del(_0x1f724d), await redis.set(_0x1f724d, _0x406d48, "NX", "PX", _0x1e8731)) : await redis.set(_0x1f724d, _0x406d48);
  }
  async ["rdel"](_0x3088a0) {
    await redis.del(_0x3088a0);
  }
  async ["rget"](_0x24e250) {
    return await redis.get(_0x24e250);
  }
  async ["rset"](_0x31fc39, _0xc87036) {
    return await redis.set(_0x31fc39, _0xc87036);
  }
  async ["acquireLock"](_0x1457d3, _0x11572a, _0x5b19d9) {
    const _0x4e7474 = await redis.set(_0x1457d3, _0x11572a, "NX", "PX", _0x5b19d9);
    return _0x4e7474 === "OK";
  }
  async ["releaseLock"](_0x57cdd6, _0x1ac4d3) {
    const _0x3f7b05 = await redis.get(_0x57cdd6);
    if (_0x3f7b05 === _0x1ac4d3) return await redis.del(_0x57cdd6), true;else {
      return false;
    }
  }
  async ["sign"](_0x3bb89b, _0x1475b4 = {}) {
    const _0x371d14 = {
      "fn": _0x3bb89b,
      "body": _0x1475b4,
      "clientVersion": clientVersion,
      "ep": true
    };
    for (let _0x59dac8 = 0; _0x59dac8 < 3; _0x59dac8++) {
      try {
        const {
          data: _0x5aa04c
        } = await this.request(getValue("M_API_SIGN_URL" + (_0x59dac8 || "")), _0x371d14, {
          "headers": {
            "Content-Type": "application/json"
          }
        }, {
          "httpAgent": false,
          "httpsAgent": false
        });
        if (_0x5aa04c.fn && _0x5aa04c.body) return this.log("diy sign获取成功"), {
          "fn": _0x5aa04c.fn,
          "sign": _0x5aa04c.body
        };
      } catch (_0x18bbc2) {
        this.log("sign error " + _0x18bbc2.message);
      }
    }
    return {};
  }
  async ["getMyPing"](_0x409479 = "customer/getMyPing") {
    const _0x31ff1a = await this.api(_0x409479, "userId=" + this.super.venderId + "&token=" + this.isvToken + "&pin=&fromType=APP&riskType=0");
    this.secretPin = _0x31ff1a.data.secretPin;
    this.nickname = _0x31ff1a.data.nickname;
    this.Pin = this.domain.includes("cjhy") ? encodeURIComponent(encodeURIComponent(this.secretPin)) : encodeURIComponent(this.secretPin);
  }
  async ["accessLog"](_0x5550a7 = "" + (this.domain.includes("cjhy") ? "common/accessLog" : "common/accessLogWithAD")) {
    await this.api(_0x5550a7, "venderId=" + this.super.venderId + "&code=" + (this.super.activityType || 99) + "&pin=" + this.Pin + "&activityId=" + this.activityId + "&pageUrl=" + encodeURIComponent(this.activityUrl) + "&subType=app&adSource=");
  }
  async ["wait"](_0x1774a8, _0x212aa8) {
    if (_0x1774a8 <= 0) return;
    return _0x212aa8 ? new Promise(_0x19070e => setTimeout(_0x19070e, this.random(_0x1774a8, _0x212aa8))) : new Promise(_0x2d0f19 => setTimeout(_0x2d0f19, _0x1774a8));
  }
  async ["send"](_0x2a1cd7) {
    getValue("M_NOTIFY_ENABLE", false) && (await this.sendMessage(_0x2a1cd7));
  }
  async ["getFansFuseMemberDetail"](_0x182653 = this.super.venderId) {
    return await this.api("https://api.m.jd.com/client.action", {
      "appId": "27004",
      "functionId": "getFansFuseMemberDetail",
      "appid": "shopmember_m_jd_com",
      "clientVersion": "12.1.3",
      "client": "iOS",
      "body": {
        "queryVersion": "12.1.6",
        "channel": 102,
        "appid": "shopmember_m_jd_com",
        "sid": this.sid,
        "sr": "shopin",
        "tabActive": "home-member",
        "un_area": this.un_area,
        "venderId": _0x182653,
        "modularFloorFlags": "sgGoodsFlag"
      },
      "version": "4.3",
      "ua": this.UA,
      "t": true
    }, {
      "h5st": true,
      "proxy": true,
      "x-api-eid-token": true,
      "x-rp-client": "h5_1.0.0",
      "Origin": "https://pages.jd.com",
      "Referer": "https://pages.jd.com/",
      "x-referer-page": "https://pages.jd.com/app/home"
    });
  }
  async ["sendSw"](_0x577b5f) {
    await this.sendMessage(_0x577b5f, getValue("TG_USER_ID_SW"), getValue("TG_BOT_TOKEN_SW"));
  }
  async ["after"]() {}
  async ["start"](_0x244c22) {
    try {
      await this.parserActivity();
      this.log("活动信息", this.activityUrl, this.baseActivityId || this.activityId || "未知", this.venderId || this.shopId || "未知");
      await this.auth();
      Promise.resolve().then(() => this.forceQuit());
      await this.buildAccount();
      const _0x38c408 = await this.readCookies();
      await this.config(_0x38c408);
      this.concNum === 0 && (this.concNum = mode ? 1 : this.masterNum || getValue("M_CONC_LIMIT") * 1);
      this.log("总任务数: " + _0x38c408.length + " 当前并发数: " + this.concNum);
      _0x38c408.length === 0 && (await redis.set("del:" + this.activityUrl, "1", "EX", 1 * 24 * 60 * 60, "NX"), this.log("没有可用账号，已加入缓存"));
      let _0x444be0 = ["m_jd_wx_dailyGift", "m_jd_wx_pointDraw", "m_jd_wx_addCart"];
      _0x444be0.includes(this.filename) && (this.log("当前时间: " + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()), await this.countdown(1, 6000));
      for (let _0x5c4c75 = 0; _0x5c4c75 < _0x38c408.length; _0x5c4c75++) {
        let _0x22572e = _0x38c408[_0x5c4c75];
        if (this.exit) {
          break;
        }
        const _0x52a07f = new _0x244c22();
        _0x52a07f.super = this;
        _0x52a07f.index = _0x5c4c75 + 1;
        Object.assign(_0x52a07f, _0x22572e);
        Object.assign(_0x52a07f, this);
        this.addTask(_0x52a07f);
        while (this.concNum === this.runningNum) {
          await this.wait(100);
        }
      }
      while (this.runningNum > 0 && !this.exit) {
        await this.wait(100);
      }
    } catch (_0xb7ced2) {
      console.log(_0xb7ced2);
    } finally {
      try {
        await this.sendMsg();
      } finally {
        await redis.quit();
        process.exit(0);
      }
    }
  }
  async ["sendMessage"](_0x1e1f21, _0x4ddd02 = this.tgChatId || getValue("TG_USER_ID"), _0x1a36fb = this.tgToken || getValue("TG_BOT_TOKEN")) {
    const _0x30706d = this.getEnv("TG_SEND_GROUP", []);
    for (let _0x32d076 of _0x30706d) {
      if (new RegExp("(" + _0x32d076.NAME_REGX.split("@").join("|") + ")").test(this.name)) {
        _0x4ddd02 = this.tgChatId || _0x32d076.TG_USER_ID;
        _0x1a36fb = this.tgToken || _0x32d076.TG_BOT_TOKEN;
        this.log("根据规则，已选择使用[" + _0x4ddd02 + "]进行推送");
        break;
      }
    }
    if (!_0x1e1f21) {
      return;
    }
    let _0x393680 = Math.ceil(_0x1e1f21.length / 3000),
      _0x58dc82 = this.splitArray(_0x1e1f21.split("\n"), _0x393680);
    for (let _0x403961 of _0x58dc82) {
      if (getValue("M_NOTIFY_COMMON")) {
        try {
          await notify.sendNotify(this.name, _0x403961.join("\n"));
        } catch (_0x1ca79b) {
          this.log(_0x1ca79b);
        } finally {
          continue;
        }
      }
      const _0xaacfbe = "https://api.telegram.org/bot" + _0x1a36fb + "/sendMessage",
        _0x201b00 = {
          "chat_id": _0x4ddd02,
          "text": _0x403961.join("\n"),
          "disable_web_page_preview": true
        },
        _0x4f1630 = {
          "headers": {
            "Content-Type": "application/json"
          }
        };
      if (getValue("TG_PROXY_HOST") && getValue("TG_PROXY_PORT")) _0x4f1630.httpsAgent = tunnel.httpsOverHttp({
        "proxy": {
          "host": getValue("TG_PROXY_HOST"),
          "port": getValue("TG_PROXY_PORT") * 1
        }
      });else {
        _0x4f1630.httpsAgent = false;
        _0x4f1630.httpAgent = false;
      }
      const {
        data: _0x2b3421
      } = await this.request(_0xaacfbe, _0x201b00, _0x4f1630);
    }
  }
  async ["sendMsg"]() {
    if (this.super?.["error"]) {
      return;
    }
    let _0x50ac76 = Date.now();
    const _0x295f88 = getValue("M_NOTIFY_COMMON") ? [] : [this.name, ""],
      _0x573625 = [];
    for (let _0x56deb9 of users.values()) {
      if (_0x56deb9.message.length > 0) {
        let _0xf81a39 = _0x56deb9.index + "【" + (this.accounts[_0x56deb9.ptpin]?.["remarks"] || this.desensitizeString(_0x56deb9.ptpin)) + "】→ " + _0x56deb9.message.join(this.joinMsg ? this.joinMsg : ",");
        _0xf81a39.includes("已填地址") && _0x573625.push(_0xf81a39);
        _0x295f88.push(_0xf81a39);
      }
    }
    if (this.rule && !this.getEnv("M_CLOSE_RULE", false)) {
      _0x295f88.push("");
      let _0x4bad7a = [];
      for (let _0x23369d of this.rule.split("\n")) {
        if (this.match(ruleSimplifyKeywordRegx, _0x23369d)) {
          continue;
        }
        _0x4bad7a.push(_0x23369d);
      }
      this.rule = _0x4bad7a.join("\n");
      this.log(this.rule);
      _0x295f88.push(this.rule);
    }
    this.actName && (_0x295f88.push(""), _0x295f88.push("活动名称: " + this.actName));
    this.shopName && _0x295f88.push("#" + this.shopName);
    this.shopId && this.venderId && _0x295f88.push("店铺信息: " + this.shopId + "_" + this.venderId);
    if (this.actStartTime || this.actEndTime) {
      this.actStartTime && !("" + this.actStartTime).includes("-") && (this.actStartTime = this.formatDate(this.actStartTime));
      this.actEndTime && !("" + this.actEndTime).includes("-") && (this.actEndTime = this.formatDate(this.actEndTime));
      _0x295f88.push("活动时间: " + (this.actStartTime || "") + " 至 " + (this.actEndTime || ""));
    }
    try {
      await this?.["after"]();
      for (let _0x978852 of this.msg) {
        _0x295f88.push(_0x978852);
      }
    } catch (_0x2b7a72) {
      this.log("after error" + _0x2b7a72.message);
    }
    if (this.activityId) {
      _0x295f88.push("#" + this.activityId);
    }
    if (this.hasMethod("upgrade")) try {
      await this.upgrade(_0x295f88);
    } catch (_0x302abc) {}
    let _0x5e02f9 = "时间：" + this.now() + " 时长：" + ((_0x50ac76 - this.__st) / 1000).toFixed(2) + "s";
    this.log(_0x5e02f9);
    _0x295f88.push(_0x5e02f9);
    await this.send(_0x295f88.join("\n"));
    if (_0x573625.length) {
      _0x573625.push("");
      _0x573625.push(this.activityUrl);
      _0x573625.push(this.activityId);
      await this.sendSw(_0x573625.join("\n"));
    }
  }
  async ["forceQuit"](_0x3cef36 = getValue("M_FORCE_QUIT_TIMEOUT", 10)) {
    let _0x2bce2d = 0;
    while ((Date.now() - this.currentTime) / 1000 / 60 < _0x3cef36 || !this.exit) {
      await this.wait(10 * 1000);
      if (!this.runningNum && ++_0x2bce2d > 60) {
        break;
      }
    }
    !this.exit && (await this.sendMessage(this.activityId + " #进程超时退出"), await this.sendMsg(), console.log("进程超时，强制退出 " + _0x2bce2d), process.exit(0));
  }
  ["objectToQueryString"](_0x34a0bf) {
    return Object.keys(_0x34a0bf).map(_0x48b3dc => _0x48b3dc + "=" + encodeURIComponent(_0x34a0bf[_0x48b3dc] instanceof Object ? JSON.stringify(_0x34a0bf[_0x48b3dc]) : _0x34a0bf[_0x48b3dc])).join("&");
  }
}
module.exports = {
  "Env": Env,
  "redis": redis,
  "cheerio": cheerio,
  "addDays": addDays,
  "differenceInMinutes": differenceInMinutes,
  "CryptoJS": CryptoJS,
  "utopia": utopia,
  "fs": fs
};