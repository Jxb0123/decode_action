//Tue Aug 13 2024 12:38:40 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
let mode = __dirname.includes("magic");
const {
    Env
  } = mode ? require("../eve") : require("./eve"),
  $ = new Env("M签到有礼");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_SHOP_SIGN_URL);
$.concurrencyLimit = parseInt(process.env?.["M_WX_SHOP_SIGN_CONC_NUM"] || 10);
$.desensitize = process.env?.["M_WX_SHOP_SIGN_DESE"] || true;
$.onlyBeanGoods = process.env.M_WX_SHOP_SIGN_BEAN_GOODS ? process.env.M_WX_SHOP_SIGN_BEAN_GOODS : false;
$.hasBeanOpenCard = parseInt(process.env.M_WX_SHOP_SIGN_BEAN_OPEN || "1");
$.retryCount = parseInt(process.env.M_WX_SHOP_SIGN_RETRY_COUNT || 5);
if (mode) {
  $.activityUrl = "https://lorealjdcampaign-rc.isvjcloud.com/prod/cc/cjwx/sign/signActivity2?activityId=7f01a4ae33e6461180b06a1500e875da&venderId=1000400341";
  $.activityUrl = "https://cjhy-isv.isvjcloud.com/sign/signActivity?activityId=cccf94640fe84353a881485cef5a604f&venderId=1000088409";
  $.activityUrl = "https://lorealjdcampaign-rc.isvjcloud.com/interact/index?activityType=10023&activityId=1641317115183362049&templateId=20210518190900rlqd01";
  $.activityUrl = "https://lzkj-isv.isvjcloud.com/sign/signActivity2?activityId=c27068bff297469da7e3f0d7a94357e8&venderId=652296";
  $.activityUrl = "https://jinggeng-isv.isvjcloud.com/ql/front/showSign?id=9e8080e58735b115018735c238d5082a&user_id=10828305";
  $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10040&activityId=1641723791791730689&templateId=20210518190900qrqd011&nodeId=101001&prd=cjwx";
  $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10023&templateId=20210518190900rlqd011&activityId=1640634987047661569&nodeId=101001&prd=cjwx&shopid=808397";
  $.activityUrl = "https://cjhy-isv.isvjcloud.com/sign/signActivity?activityId=8b2ace1e16154e92a704e87a1ef7acca&shopid=1000362843&utm_user=plusmember&gxd=RnAokGFfPjXeypwS-4IkWO33jDhA1mk";
  $.activityUrl = "https://cjhy-isv.isvjcloud.com/sign/sevenDay/signActivity?activityId=9f659965f42745a58802227eff142436&venderId=1000354811";
  $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10002&activityId=1673598837623214081&templateId=20201228083300lxqdsl011&nodeId=101001003&prd=cjwx";
  $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10023&templateId=20210518190900rlqd011&activityId=1660606008074641410&nodeId=101001&prd=cjwx&shopid=1000355021";
  $.activityUrl = "https://cjhy-isv.isvjcloud.com/sign/signActivity?activityId=7c368c5b88e64b71a2e2c5fe0bb589b8&venderId=1000080629";
  $.activityUrl = "https://hdb-isv.isvjcloud.com/h5/pages/SignIn/sevenDaysin?id=180a4f2a390f3d09895996f8c59668a1&userId=1000461510";
  $.activityUrl = "https://lzkj-isv.isvjcloud.com/sign/signActivity2?activityId=93fafab4cab14a05b0a6315cde0e88f2&venderId=1000088787&adsource=tg_storePage";
  $.activityUrl = "https://jinggeng-isv.isvjcloud.com/ql/front/showSign?id=9e80807b8909eb2701890cd9380354e0&user_id=1000121005";
  $.activityUrl = "https://hdb-isv.isvjcloud.com/h5/pages/SignIn/SignIn?id=1f9cab083b0ca40e34b0b2adf8ea6b6b&userId=1000350703";
  $.activityUrl = "https://hdb-isv.isvjcloud.com/h5/pages/SignIn/SignIn2?id=785881466e3409fb5b0be4c9343c0d01&userId=28999";
  $.activityUrl = "https://hdb-isv.isvjcloud.com/h5/pages/SignIn/SignIn3?id=808e75be78016d519062a8a4427114f3&userId=1000074823";
  $.activityUrl = "https://hdb-isv.isvjcloud.com/h5/pages/SignIn/sevenDaysin?id=180a4f2a390f3d09895996f8c59668a1&userId=1000461510";
  $.activityUrl = "https://hdb-isv.isvjcloud.com/h5/pages/SignIn/sevenDaysin2?id=e3e7ece8912e25b16454e95dd4074e6f&userId=1000014286";
  $.activityUrl = "https://jingyun-rc.isvjcloud.com/h5/pages/SignIn/sevenDaysin2?id=e3e7ece8912e25b16454e95dd4074e6f&userId=1000014286";
}
$.version = "v1.0.0";
$.sevenDay = $.activityUrl.includes("sevenDay") || ["10040"].includes($.activityType);
class Task extends Env {
  constructor(_0x2d95b2) {
    super();
  }
  async ["getPrizeList"](_0x5d0220) {
    if ($.prizeList.length > 0) return;
    if ($.is100V2Type) {
      if (!$.rule) return;
      let _0x814805 = await this.api("/api/" + this.activityType + "/getPrizeList", {}),
        _0x5dad75 = [];
      for (let _0x46f2c4 of _0x814805.data || []) {
        let _0x42deb2 = "";
        if (_0x46f2c4.prizeName) _0x42deb2 = _0x46f2c4.prizeName;else switch (_0x46f2c4.signType) {
          case 0:
            try {
              _0x42deb2 = $.rule.split("每日签到，有机会赠送[")[1].split("]")[0];
            } catch (_0x125744) {
              _0x42deb2 = _0x46f2c4.prizeImg.includes("b53b1246de5f2089") ? "积分" : _0x46f2c4.prizeImg.includes("f9ab956ec09a4146") ? "京豆" : "未知";
            }
            break;
          case 1:
            _0x42deb2 = $.rule.split("累计签到" + _0x46f2c4.signDays + "天，有机会获得")[1].split("，")[0];
            break;
          case 2:
            _0x42deb2 = $.rule.split("连续签到" + _0x46f2c4.signDays + "天，有机会获得")[1].split("，")[0];
            break;
          case 3:
            _0x42deb2 = $.rule.split("签到" + _0x46f2c4.signDays + "天，有机会获得")[1].split("，")[0];
            break;
          default:
            _0x42deb2 = _0x46f2c4.prizeImg.includes("b53b1246de5f2089") ? "积分" : _0x46f2c4.prizeImg.includes("f9ab956ec09a4146") ? "京豆" : "未知";
            break;
        }
        _0x5dad75.push({
          "dayNum": _0x46f2c4.signDays,
          "giftName": _0x42deb2,
          "giftType": _0x42deb2.includes("积分") ? 9 : _0x42deb2.includes("京豆") ? 6 : _0x42deb2.includes("优惠券") ? 1 : 7,
          "giftTotal": _0x46f2c4.remainNum
        });
      }
      $.prizeList = _0x5dad75;
      return;
    } else {
      if (["10023"].includes($.activityType)) {
        let _0x89050a = $.activityType == "10002" ? "sign" : "daySign";
        _0x5d0220 = await this.api("/api/task/" + _0x89050a + "/activity", {});
        if (!_0x5d0220.data) {
          this.putMsg(_0x5d0220.reso_msg || "请确认活动有效性");
          $.exit = true;
          return;
        }
        let _0x42bf7f = [],
          _0x2f5283 = await this.api("/api/active/getRule", {});
        $.rule = _0x2f5283.data;
        let _0x42e9ed = await this.api("/api/prize/drawPrize", {});
        $.prizeList = _0x42e9ed.data.prizeInfo || [];
        for (let _0x3bfaa6 of _0x5d0220.data?.["signPiize"] || []) {
          let _0x231236 = "";
          if (_0x3bfaa6.signType == 0) {
            try {
              _0x231236 = $.rule.split("每日签到，有机会赠送[")[1].split("]")[0];
            } catch (_0x39d2e2) {
              _0x231236 = $.rule.split("每日签到，赠送[")[1].split("]")[0];
            }
            _0x42bf7f.push({
              "giftName": _0x231236,
              "giftType": _0x231236.includes("积分") ? 9 : _0x231236.includes("京豆") ? 6 : _0x231236.includes("优惠券") ? 1 : 7,
              "giftTotal": _0x3bfaa6.lestNumber
            });
          }
          if (_0x3bfaa6.signType == 1) {
            try {
              _0x231236 = $.rule.split("累计签到" + _0x3bfaa6.signNumber + "天，有机会赠送[")[1].split("]")[0];
            } catch (_0x115cea) {
              _0x231236 = $.rule.split("累计签到" + _0x3bfaa6.signNumber + "天，额外赠送[")[1].split("]")[0];
            }
            _0x42bf7f.push({
              "dayNum": _0x3bfaa6.signNumber,
              "giftType": _0x231236.includes("积分") ? 9 : _0x231236.includes("京豆") ? 6 : _0x231236.includes("优惠券") ? 1 : 7,
              "giftName": _0x231236,
              "giftTotal": _0x3bfaa6.lestNumber
            });
          }
          if (_0x3bfaa6.signType == 2) {
            try {
              _0x231236 = $.rule.split("连续签到" + _0x3bfaa6.signNumber + "天，有机会赠送[")[1].split("]")[0];
            } catch (_0x9df7af) {
              _0x231236 = $.rule.split("连续签到" + _0x3bfaa6.signNumber + "天，额外赠送[")[1].split("]")[0];
            }
            _0x42bf7f.push({
              "dayNum": _0x3bfaa6.signNumber,
              "giftType": _0x231236.includes("积分") ? 9 : _0x231236.includes("京豆") ? 6 : _0x231236.includes("优惠券") ? 1 : 7,
              "giftName": _0x231236,
              "giftTotal": _0x3bfaa6.lestNumber
            });
          }
          if (_0x3bfaa6.signType == 3) {
            try {
              _0x231236 = $.rule.split("签到" + _0x3bfaa6.signNumber + "天，有机会赠送[")[1].split("]")[0];
            } catch (_0x564637) {
              _0x231236 = $.rule.split("签到" + _0x3bfaa6.signNumber + "天，额外赠送[")[1].split("]")[0];
            }
            _0x42bf7f.push({
              "dayNum": _0x3bfaa6.signNumber,
              "giftType": _0x231236.includes("积分") ? 9 : _0x231236.includes("京豆") ? 6 : _0x231236.includes("优惠券") ? 1 : 7,
              "giftName": _0x231236,
              "giftTotal": _0x3bfaa6.lestNumber
            });
          }
        }
        $.prizeListShow = _0x42bf7f;
      } else {
        if (["10040"].includes($.activityType)) {
          let _0x2991cf = [],
            _0x3bb07c = await this.api("/api/prize/drawPrize", {});
          $.prizeList = _0x3bb07c.data.prizeInfo || [];
          for (let _0x3fcc82 of _0x3bb07c.data.prizeInfo) {
            _0x2991cf.push({
              "dayNum": _0x3fcc82.position,
              "giftName": _0x3fcc82.prizeName,
              "giftType": _0x3fcc82.prizeType,
              "giftTotal": _0x3fcc82.leftNum
            });
          }
          $.prizeListShow = _0x2991cf;
        } else {
          if (["10002"].includes($.activityType)) {
            let _0x4dd7df = [],
              _0x5c1201 = await this.api("/api/task/sign/prizeList", {});
            $.prizeList = _0x5c1201.data.prizeInfo || [];
            for (let _0x1c0c4c of _0x5c1201.data.prizeInfo) {
              _0x4dd7df.push({
                "dayNum": _0x1c0c4c.days,
                "giftName": _0x1c0c4c.prizeName,
                "giftType": _0x1c0c4c.prizeType,
                "giftTotal": _0x1c0c4c.leftNum
              });
            }
            $.prizeListShow = _0x4dd7df;
          } else {
            if ($.jinggengTypes.includes($.domain)) {
              let _0x1a0b28 = [];
              $.rule.split(/\n|;/).forEach(_0x3de9e3 => {
                let _0x789704 = $.match(/每日签到赠送(\d+)([\u4e00-\u9fa5]{2})/, _0x3de9e3);
                if (_0x789704 && _0x789704.length > 0) _0x1a0b28.push({
                  "equityType": _0x789704[1].includes("积分") ? "JD_POINT" : _0x789704[1].includes("京豆") ? "JD_BEAN" : _0x789704[1].includes("优惠券") ? "JD_COUPON" : _0x789704[1],
                  "giftName": _0x789704[0] * 1 + _0x789704[1],
                  "giftType": _0x789704[1].includes("积分") ? 9 : _0x789704[1].includes("京豆") ? 6 : _0x789704[1].includes("优惠券") ? 1 : 7,
                  "availableQuantity": 999
                });else {
                  let _0x5ec20e = $.match(/连续签到(\d+)天,赠送(\d+)([\u4e00-\u9fa5]{2})/g, _0x3de9e3);
                  _0x5ec20e && _0x5ec20e.length > 0 && _0x1a0b28.push({
                    "equityType": _0x5ec20e[2].includes("积分") ? "JD_POINT" : _0x5ec20e[2].includes("京豆") ? "JD_BEAN" : _0x5ec20e[2].includes("优惠券") ? "JD_COUPON" : _0x5ec20e[1],
                    "giftName": _0x5ec20e[1] + _0x5ec20e[2],
                    "giftType": _0x5ec20e[2].includes("积分") ? 9 : _0x5ec20e[2].includes("京豆") ? 6 : _0x5ec20e[2].includes("优惠券") ? 1 : 7,
                    "dayNum": _0x5ec20e[0],
                    "availableQuantity": 999
                  });
                }
              });
              $.prizeListShow = _0x1a0b28;
            } else {
              if ($.domain.includes("txzj-isv.isvjcloud.com")) {
                let _0x28bbb9 = [];
                $.rule.split(/\n/).forEach(_0x4a9dba => {
                  let _0x10f443 = $.match(/每日签到，有机会获得(\d+)([\u4e00-\u9fa5]{2})/, _0x4a9dba);
                  if (_0x10f443 && _0x10f443.length > 0) _0x28bbb9.push({
                    "equityType": _0x10f443[1].includes("积分") ? "JD_POINT" : _0x10f443[1].includes("京豆") ? "JD_BEAN" : _0x10f443[1].includes("优惠券") ? "JD_COUPON" : _0x10f443[1],
                    "giftName": _0x10f443[0] * 1 + _0x10f443[1],
                    "giftType": _0x10f443[1].includes("积分") ? 9 : _0x10f443[1].includes("京豆") ? 6 : _0x10f443[1].includes("优惠券") ? 1 : 7,
                    "availableQuantity": 999
                  });else {
                    let _0x3f71ce = $.match(/连续签到(\d+)天，有机会获得(\d+)([\u4e00-\u9fa5]{2})/g, _0x4a9dba);
                    if (_0x3f71ce && _0x3f71ce.length > 0) {
                      _0x28bbb9.push({
                        "equityType": _0x3f71ce[2].includes("积分") ? "JD_POINT" : _0x3f71ce[2].includes("京豆") ? "JD_BEAN" : _0x3f71ce[2].includes("优惠券") ? "JD_COUPON" : _0x3f71ce[1],
                        "giftName": _0x3f71ce[1] + _0x3f71ce[2],
                        "giftType": _0x3f71ce[2].includes("积分") ? 9 : _0x3f71ce[2].includes("京豆") ? 6 : _0x3f71ce[2].includes("优惠券") ? 1 : 7,
                        "dayNum": _0x3f71ce[0],
                        "availableQuantity": 999
                      });
                    }
                  }
                });
                $.prizeListShow = _0x28bbb9;
              } else {
                if ($.hdbTypes.includes($.domain)) {
                  let _0x14f1af = await this.api("/front/activity/loadFrontAward", {});
                  if (_0x14f1af.succ) $.prizeList = _0x14f1af.result || [];else this.log(_0x14f1af.message);
                }
              }
            }
          }
        }
      }
    }
  }
  async ["exec"]() {
    if (!$.superVersion) throw new Error("请更新脚本");
    if (!$.activityId || !$.activityUrl) {
      $.exit = true;
      this.putMsg("activityId|activityUrl不存在", $.activityUrl, $.activityId);
      return;
    }
    let _0x9e6d5 = await this.login({
      "fn": $.jinggengTypes.includes($.domain) ? "ql/front/showSign" : ""
    });
    if ($.is100V2Type) {
      let _0x53f49b = 0,
        _0x538d2a = false,
        _0x2b6cad = 0;
      if (["10001", "10023"].includes(this.activityType)) {
        const _0x24f558 = await this.api("/api/" + this.activityType + "/calendar", {});
        if (_0x24f558.code !== 200) {
          this.putMsg(_0x24f558.message);
          return;
        }
        _0x53f49b = _0x24f558.data.continuousSignDays || _0x24f558.data.signDays;
        _0x538d2a = _0x24f558.data.sign;
        _0x2b6cad = _0x24f558.data.signDayCount;
        ["10001"].includes(this.activityType) && !$.prizeListShow && ($.prizeListShow = $.prizeList.map(_0x2443d9 => {
          return {
            ..._0x2443d9,
            "dayNum": "每" + _0x2b6cad,
            "giftName": "抽" + _0x2443d9.giftName
          };
        }));
      } else {
        if (["10003"].includes(this.activityType)) {
          const _0x5c3f9a = await this.api("/api/" + this.activityType + "/activity", {});
          if (_0x5c3f9a.code !== 200) {
            this.putMsg(_0x5c3f9a.message);
            return;
          }
          _0x53f49b = _0x5c3f9a.data.signDays;
          _0x538d2a = _0x5c3f9a.data.sign;
        }
      }
      if (_0x538d2a) this.putMsg("已签" + _0x53f49b + "天");else {
        const _0x35b5c3 = await this.api("/api/" + this.activityType + "/sign", {});
        _0x53f49b++;
        this.putMsg("签到成功，已签" + _0x53f49b + "天");
        if (["10001"].includes(this.activityType)) {
          const _0x16a527 = await this.api("/api/" + this.activityType + "/chanceNum", {});
          if (_0x16a527.data >= 1) for (let _0x26dfdb = 0; _0x26dfdb < chanceNumDecryData; _0x26dfdb++) {
            const _0x11d69f = await this.api("/api/" + this.activityType + "/lotteryDraw", {});
            this.putMsg(_0x11d69f.data?.["prizeName"] || "空气");
          } else this.log("暂无抽奖机会， 继续签到吧");
        } else this.putMsg(_0x35b5c3.data?.["prizeName"] || "空气");
      }
      return;
    }
    if ($.domain.includes("txzj-isv.isvjcloud.com")) {
      let _0x1926e3 = $.match(/活动时间(\d{4}-\d{2}-\d{2}) - (\d{4}-\d{2}-\d{2})/, $.rule);
      $.actStartTime = _0x1926e3[0];
      $.actEndTime = _0x1926e3[1];
      await this.checkActivity($.rule);
      const _0x4c7445 = await this.api("sign_in/get_sign_in_info", "pid=" + $.activityId),
        {
          code: _0x57d034,
          msg: _0x3d2dd3,
          data: _0x3f07c6
        } = _0x4c7445;
      if (_0x57d034 !== "success") {
        throw new Error(_0x3d2dd3);
      }
      if (_0x3f07c6.today_status) {
        this.putMsg(_0x3f07c6.title + " 已签到");
        return;
      }
      const _0x18ac64 = await this.api("sign_in/receive_prize", "pid=" + $.activityId),
        {
          code: _0x4c42ea,
          msg: _0x27b53d,
          data: _0x52e258
        } = _0x18ac64;
      if (_0x4c42ea !== "success") throw new Error(_0x27b53d);
      this.log(_0x18ac64);
      this.putMsg("签到成功");
      return;
    }
    if ($.hdbTypes.includes($.domain)) {
      let _0x4d8140 = await this.api("front/activity/signLoad", {}),
        _0x1fa2bd = _0x4d8140.result?.["signLog"]?.["continueCount"] || 0;
      if (_0x4d8140.result?.["signLog"]?.["lastSignTime"] && $.formatDate(new Date(_0x4d8140.result.signLog.lastSignTime), "yyyy-MM-dd") === $.now("yyyy-MM-dd")) this.putMsg("已签" + _0x1fa2bd + "天");else {
        let _0x238097 = await this.api("front/activity/signPost", {});
        _0x238097.succ && (_0x1fa2bd++, _0x238097.result.awardRes.succ && _0x238097.result.awardRes.needSend && this.putMsg(await $.getAwardText(_0x238097.result.awardRes.dmAward)));
        this.putMsg(_0x238097.message + ("已签" + _0x1fa2bd + "天"));
      }
      return;
    }
    if ($.jinggengTypes.includes($.domain)) {
      $.isSign = _0x9e6d5("#isSign", "body").attr("value") === "1";
      let _0x2e100c = _0x9e6d5("#continueCount", "body").attr("value") || 0;
      if (!$.isSign) {
        await this.api("/ql/front/reportActivity/recordActPvUvData", "userId=" + $.userId + "&actId=" + $.activityId);
        await this.api("front/followShop", "userId=" + $.userId);
        let _0x3e3511 = await this.api("ql/front/saveSignIn", "user_id=" + $.userId + "&act_id=" + $.activityId);
        if (_0x3e3511.succ) {
          let _0x1d94f4 = JSON.parse(_0x3e3511.msg);
          _0x1d94f4.isSendSucc ? this.putMsg(_0x1d94f4.actLogDto.remark) : this.putMsg("空气");
          this.putMsg("已签" + ++_0x2e100c + "天");
        } else {
          this.putMsg(_0x3e3511.msg);
          await this.wxStop(_0x3e3511.msg);
        }
      } else this.putMsg("已签" + _0x2e100c + "天");
      try {
        let _0x19d7f9 = await this.api("/ql/front/SearchCustomAward", "userId=" + $.userId + "&actId=" + $.activityId);
        if (_0x19d7f9?.["qlActLogParams"]?.["resultList"]?.["length"] > 0) for (let _0x13fa2f of _0x19d7f9?.["qlActLogParams"]?.["resultList"]?.["filter"](_0x4781f7 => _0x4781f7.created.slice(0, 10) === $.now("yyyy-MM-dd"))) {
          this.putMsg(_0x13fa2f.remark);
          _0x13fa2f.awardType === "JD_GOODS" && (this.addressId = _0x19d7f9.actLogId, this.prizeName = awardName, await this.saveAddress());
        }
      } catch (_0x35ed3d) {
        console.log(_0x35ed3d);
      }
    } else {
      if (["10023", "10040", "10002", "10003"].includes($.activityType)) {
        let _0x2783f0 = ["10002", "10003"].includes($.activityType) ? "sign" : "daySign",
          _0x3a906b = await this.api("/api/task/" + _0x2783f0 + "/activity", {});
        if (!_0x3a906b.data) {
          this.putMsg(_0x3a906b.reso_msg || "请确认活动有效性");
          $.exit = true;
          return;
        }
        let _0x51a5b7 = _0x3a906b,
          _0x41ae10 = ["10002", "10003"].includes($.activityType) ? _0x51a5b7.data.signContinuityNum : _0x51a5b7.data.continuityNum,
          _0x57bb8f = ["10002", "10003"].includes($.activityType) ? "add" : "getSignClick";
        if ($.sevenDay && _0x51a5b7.data.continuityNum < 7 && _0x51a5b7.data.sign == true || !$.sevenDay && _0x51a5b7.data.sign == true) {
          let _0x438877 = await this.api("/api/task/" + _0x2783f0 + "/" + _0x57bb8f, {});
          _0x438877.resp_code == 0 ? _0x41ae10++ : this.putMsg(_0x438877.resp_msg);
        } else _0x41ae10 = _0x51a5b7.data?.["signNum"] || 0;
        try {
          let _0x297ef7 = await this.api("/api/my/prize/list", {
            "current": "1",
            "size": "10000"
          });
          if (_0x297ef7.resp_code == 0) for (_0x297ef7 of _0x297ef7.data?.["filter"](_0x4ef6c8 => _0x4ef6c8.dayTime == $.now("yyyy-MM-dd"))) {
            this.putMsg(_0x297ef7.prizeName);
            if (_0x297ef7.prizeType == 3) {
              this.addressId = _0x297ef7.addressId;
              this.prizeName = _0x297ef7.prizeName;
              await this.saveAddress();
            }
          } else this.putMsg(_0x297ef7.resp_msg || "空气");
        } catch (_0x5a5918) {
          console.log(_0x5a5918);
        }
        this.putMsg("已签" + _0x41ae10 + "天");
      } else {
        if (["10004"].includes($.activityType)) {
          activityContent = await this.api("/api/task/sign/activity", {});
          console.log(activityContent);
          if (!activityContent.data) {
            this.putMsg(activityContent.reso_msg || "请确认活动有效性");
            $.exit = true;
            return;
          }
          let _0x41732c = await this.api("/api/task/sign/add", {});
          console.log(_0x41732c);
          if (_0x41732c.resp_code !== 0) {
            this.putMsg(_0x41732c.resp_msg);
          } else this.putMsg("签到成功");
          let _0x1a8951 = await this.api("/api/prize/draw", {});
          console.log(_0x1a8951);
          return;
        } else {
          let _0x228012 = await this.api("sign/" + ($.sevenDay ? "sevenDay/" : "") + "wx/getActivity", "actId=" + $.activityId + "&venderId=" + $.venderId);
          if (!_0x228012.isOk) {
            this.putMsg(_0x228012.msg || "活动已结束");
            $.exit = true;
            return;
          }
          $.actStartTime = _0x228012.act.startTime;
          $.actEndTime = _0x228012.act.endTime;
          if ($.timestamp() > _0x228012.act.endTime) {
            this.putMsg("活动已结束");
            $.exit = true;
            return;
          }
          if ($.prizeList.length === 0) {
            let _0x510261 = [];
            if ($.sevenDay) {
              for (let _0x5d36ac of _0x228012.act?.["giftBean"]?.["giftConditions"] || []) {
                _0x5d36ac.gift && (_0x5d36ac.gift.dayNum = _0x5d36ac.dayNum, _0x510261.push(_0x5d36ac.gift));
              }
            } else {
              _0x228012.act.wxSignActivityGiftBean.hasGiftEveryDay === "y" && _0x510261.push(_0x228012.act.wxSignActivityGiftBean.gift);
              if (_0x228012.act.wxSignActivityGiftBean.giftConditions.length > 0) {
                for (let _0x5bc279 of _0x228012.act.wxSignActivityGiftBean.giftConditions) {
                  _0x5bc279.gift && (_0x5bc279.gift.dayNum = _0x5bc279.dayNum, _0x510261.push(_0x5bc279.gift));
                }
              }
            }
            $.prizeList = _0x510261;
          }
          let _0x51f3f4 = $.prizeList.filter(_0xe18be => ["6", "7", "9", "13", "14", "15", "16"].includes(_0xe18be.giftType));
          if (_0x51f3f4.length === 0) {
            this.putMsg("垃圾或领完");
            $.exit = true;
            return;
          }
          if ($.onlyBeanGoods && $.prizeList.filter(_0x273d17 => ["6", "7", "13", "14", "15", "16"].includes(_0x273d17.giftType)).length === 0) {
            this.putMsg("垃圾或领完");
            $.exit = true;
            return;
          }
          let _0x199373 = await this.api("sign/" + ($.sevenDay ? "sevenDay/" : "") + "wx/getSignInfo", "venderId=" + $.venderId + "&pin=" + this.Pin + "&actId=" + $.activityId),
            _0x3cc751 = $.sevenDay ? _0x199373?.["contiSignDays"] || 0 : _0x199373?.["signRecord"]?.["contiSignNum"] || 0;
          if ($.sevenDay && _0x199373.isSign === "n" || !$.sevenDay && _0x199373.signRecord.lastSignDate !== $.now("yyyyMMdd") * 1) for (let _0x1a6c0d = 0; _0x1a6c0d < $.retryCount; _0x1a6c0d++) {
            let _0x3510dd = await this.wxSign();
            if (_0x3510dd > 0) {
              _0x3cc751++;
              break;
            }
          }
          this.putMsg("已签" + _0x3cc751 + "天");
          if (!this.isaddr) try {
            let _0x34be88 = await this.api("sign/" + ($.sevenDay ? "sevenDay/" : "") + "wx/getGiftRecords", "venderId=" + $.venderId + "&pin=" + this.Pin + "&actId=" + $.activityId);
            if (_0x34be88.isOk) for (let _0x1835d6 of _0x34be88?.["records"]?.["filter"](_0x525a93 => _0x525a93.giftDate + "" === $.now("yyyyMMdd"))) {
              this.putMsg(_0x1835d6.giftName);
              _0x1835d6.gift.giftType === "7" && (this.addressId = _0x1835d6.addressId, this.prizeName = _0x1835d6.giftName, await this.saveAddress());
            } else this.putMsg(signUp.msg);
          } catch (_0x5331b3) {
            console.log(_0x5331b3);
          }
        }
      }
    }
  }
  async ["wxSign"]() {
    try {
      let _0x3877bc = await this.api("sign/" + ($.sevenDay ? "sevenDay/" : "") + "wx/signUp", "actId=" + $.activityId + "&pin=" + this.Pin);
      if (_0x3877bc.isOk) {
        this.putMsg("" + (_0x3877bc?.["gift"]?.["giftName"] || _0x3877bc?.["signResult"]?.["gift"]?.["giftName"] || "空气"));
        if (_0x3877bc?.["needWriteAddress"] !== "y") return 1;
        this.addressId = _0x3877bc.addressId;
        this.prizeName = _0x3877bc?.["gift"]?.["giftName"] || _0x3877bc?.["signResult"]?.["gift"]?.["giftName"];
        await this.saveAddress();
        this.isaddr = true;
        return 1;
      } else {
        if (!_0x3877bc) return -1;
        this.log(_0x3877bc);
        if (_0x3877bc.msg.includes("会员")) {
          if ($.prizeList.filter(_0x2e72d1 => ["6", "7"].includes(_0x2e72d1.giftType)).length > 0 && $.hasBeanOpenCard === 1) {
            await this.openCard();
            await this.wxSign();
          } else {
            this.putMsg(_0x3877bc.msg);
          }
        } else this.putMsg(_0x3877bc.msg);
        return await this.wxStop(_0x3877bc.msg), 1;
      }
    } catch (_0x507ace) {
      console.log(_0x507ace);
    }
    return -1;
  }
}
$.after = async function () {
  try {
    let _0x47876d = {
      1: "券",
      6: "京豆",
      7: "实物",
      9: "积分",
      10: "券",
      17: "券"
    };
    if ($.hdbTypes.includes($.domain)) {
      let _0x484589 = [],
        _0x54943a = $.rule.match(/(每日|连续|累计)签到(\d+天)?有机会领取/g);
      console.log(_0x54943a);
      for (let _0x5f3f9b = 0; _0x5f3f9b < $.prizeList.length; _0x5f3f9b++) {
        let _0x5daa82 = $.prizeList[_0x5f3f9b];
        _0x484589.push({
          "dayNum": _0x54943a[_0x5f3f9b].includes("每日") ? "" : _0x54943a[_0x5f3f9b].match(/\d+/)[0],
          "giftName": _0x5daa82.awardName,
          "giftType": _0x5daa82.awardType === "JD_MARKET" ? 6 : _0x5daa82.awardType === "JD_MARKET" ? 7 : 9,
          "giftTotal": _0x5daa82.awardTotalQuantity
        });
      }
      $.prizeList = _0x484589;
    }
    for (let _0x1cc280 of $.prizeListShow || $.prizeList || []) {
      $.msg.push("    " + (_0x1cc280?.["dayNum"] || "每") + "天 " + _0x1cc280.giftName + " " + (!_0x47876d[_0x1cc280?.["giftType"]] ? _0x1cc280?.["giftType"] : "") + " " + (_0x1cc280.giftTotal ? _0x1cc280.giftTotal + "份" : "") + " " + (_0x1cc280?.["insufficient"] === true ? "已发完" : ""));
    }
  } catch (_0x5ad4b3) {
    console.log(_0x5ad4b3);
  }
  $.msg.push("export M_WX_SHOP_SIGN_URL=\"" + $.activityUrl + "\"");
};
$.start(Task);