//Sat Dec 28 2024 02:38:28 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
const axios = require("axios"),
  jsonSchema = BncrCreateSchema.object({
    qinglongConfigs: BncrCreateSchema.array(BncrCreateSchema.object({
      srcQinglong: BncrCreateSchema.object({
        url: BncrCreateSchema.string().setTitle("源面板URL").setDefault(""),
        clientId: BncrCreateSchema.string().setTitle("源面板Client ID").setDefault(""),
        clientSecret: BncrCreateSchema.string().setTitle("源面板Client Secret").setDefault(""),
        customRemarks: BncrCreateSchema.string().setTitle("源面板备注").setDefault(""),
        version: BncrCreateSchema.string().setTitle("源面板版本").setDefault("2.17.9")
      }).setTitle("源青龙面板配置"),
      dstQinglongList: BncrCreateSchema.array(BncrCreateSchema.object({
        url: BncrCreateSchema.string().setTitle("目标面板URL").setDefault(""),
        clientId: BncrCreateSchema.string().setTitle("目标面板Client ID").setDefault(""),
        clientSecret: BncrCreateSchema.string().setTitle("目标面板Client Secret").setDefault(""),
        customRemarks: BncrCreateSchema.string().setTitle("目标面板备注").setDefault(""),
        version: BncrCreateSchema.string().setTitle("目标面板版本").setDefault("2.17.10"),
        enabled: BncrCreateSchema.boolean().setTitle("是否启用目标面板").setDefault(true)
      })).setTitle("目标青龙面板配置"),
      importSettings: BncrCreateSchema.object({
        mode: BncrCreateSchema.number().setTitle("导入模式").setDefault(1).setDescription("0: 全部导入, 1: 按顺序导入, 2: 随机导入, 3: 指定pin导入"),
        numToImport: BncrCreateSchema.number().setTitle("导入数量").setDefault(3),
        specifiedPins: BncrCreateSchema.array(BncrCreateSchema.string()).setTitle("指定导入的pt_pin列表"),
        blockedPins: BncrCreateSchema.array(BncrCreateSchema.string()).setTitle("需要屏蔽的pt_pin列表").setDefault([]),
        batchSize: BncrCreateSchema.number().setTitle("每批导入数量").setDefault(10)
      }),
      customSettings: BncrCreateSchema.object({
        userName: BncrCreateSchema.string().setTitle("导入目标面板备注").setDefault("")
      })
    })).setTitle("青龙面板配置列表")
  }),
  _0x517f8f = {
    delayBetweenRequests: 1500,
    timeout: 15000,
    retryTimes: 3,
    retryInterval: 5000
  };
const _0x5c0030 = {
  level: "INFO",
  timestamp: true
};
const _0x160b63 = {
  common: _0x517f8f,
  log: _0x5c0030
};
const ConfigDB = new BncrPluginConfig(jsonSchema),
  utils = {
    sleep(_0x7264f1) {
      return new Promise(_0x17e503 => setTimeout(_0x17e503, _0x7264f1));
    },
    formatDate(_0x5f4bc4 = new Date()) {
      const _0x28e6b8 = _0x1e0934 => String(_0x1e0934).padStart(2, "0"),
        _0x30b745 = _0x5f4bc4.getFullYear();
      const _0x2522e5 = _0x28e6b8(_0x5f4bc4.getMonth() + 1),
        _0x31865c = _0x28e6b8(_0x5f4bc4.getDate()),
        _0x20160c = _0x28e6b8(_0x5f4bc4.getHours()),
        _0x1e20e6 = _0x28e6b8(_0x5f4bc4.getMinutes()),
        _0x8fd92b = _0x28e6b8(_0x5f4bc4.getSeconds());
      return _0x30b745 + "-" + _0x2522e5 + "-" + _0x31865c + " " + _0x20160c + ":" + _0x1e20e6 + ":" + _0x8fd92b;
    },
    formatTimestamp() {
      return "[" + this.formatDate() + "]";
    },
    generateImportId() {
      const _0x2c6bd8 = new Date();
      const _0x3ff096 = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      return "" + _0x2c6bd8.getFullYear() + String(_0x2c6bd8.getMonth() + 1).padStart(2, "0") + String(_0x2c6bd8.getDate()).padStart(2, "0") + String(_0x2c6bd8.getHours()).padStart(2, "0") + String(_0x2c6bd8.getMinutes()).padStart(2, "0") + "_" + _0x3ff096;
    },
    isValidUrl(_0x21db21) {
      try {
        new URL(_0x21db21);
        return _0x21db21.startsWith("http://") || _0x21db21.startsWith("https://");
      } catch (_0x9b33c7) {
        return false;
      }
    },
    validateConfig(_0x2a2398) {
      const _0x3fd21a = [];
      (!_0x2a2398.url || !this.isValidUrl(_0x2a2398.url)) && _0x3fd21a.push("无效的URL: " + _0x2a2398.url);
      (!_0x2a2398.clientId || _0x2a2398.clientId.length < 5) && _0x3fd21a.push("无效的Client ID");
      (!_0x2a2398.clientSecret || _0x2a2398.clientSecret.length < 5) && _0x3fd21a.push("无效的Client Secret");
      if (_0x3fd21a.length > 0) {
        throw new Error("配置验证失败: " + _0x3fd21a.join(", "));
      }
    },
    async retry(_0x3743a9, _0x179c27 = _0x160b63.common.retryTimes, _0x2219b0 = _0x160b63.common.retryInterval) {
      let _0x284ba6;
      for (let _0x2b86dd = 0; _0x2b86dd < _0x179c27; _0x2b86dd++) {
        try {
          return await _0x3743a9();
        } catch (_0x248794) {
          _0x284ba6 = _0x248794;
          _0x2b86dd < _0x179c27 - 1 && (logger.warn("操作失败，" + _0x2219b0 / 1000 + "秒后重试(" + (_0x2b86dd + 1) + "/" + _0x179c27 + ")"), await this.sleep(_0x2219b0));
        }
      }
      throw _0x284ba6;
    }
  },
  _0x3d11d9 = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  };
const logger = {
  levels: _0x3d11d9,
  log(_0x2c07b2, _0x3c8083, _0xe2ea03 = null) {
    if (this.levels[_0x2c07b2] >= this.levels[_0x160b63.log.level]) {
      const _0x19d2f2 = _0x160b63.log.timestamp ? utils.formatTimestamp() : "",
        _0x44a635 = _0x19d2f2 + " [" + _0x2c07b2 + "] " + _0x3c8083;
      console.log(_0x44a635);
      if (_0xe2ea03) {
        if (_0xe2ea03.response) {
          const _0x40ff7b = {
            status: _0xe2ea03.response.status,
            data: _0xe2ea03.response.data,
            url: _0xe2ea03.config?.["url"],
            method: _0xe2ea03.config?.["method"],
            headers: _0xe2ea03.config?.["headers"]
          };
          console.error(_0x19d2f2 + " [" + _0x2c07b2 + "] Response Error:", JSON.stringify(_0x40ff7b, null, 2));
        } else {
          console.error(_0x19d2f2 + " [" + _0x2c07b2 + "] Error Details:", _0xe2ea03.message || _0xe2ea03);
        }
      }
    }
  },
  debug(_0x5d82b1) {
    this.log("DEBUG", _0x5d82b1);
  },
  info(_0x4d447a) {
    this.log("INFO", _0x4d447a);
  },
  warn(_0x1426a8) {
    this.log("WARN", _0x1426a8);
  },
  error(_0x2a9627, _0x279bcf) {
    this.log("ERROR", _0x2a9627, _0x279bcf);
  },
  request(_0x4292fc, _0x37c86e, _0x56d054 = null) {
    const _0x1d7074 = _0x37c86e.replace(/client_secret=([^&]+)/, "client_secret=***");
    this.debug(_0x4292fc.toUpperCase() + " " + _0x1d7074 + (_0x56d054 ? "\nParams: " + JSON.stringify(_0x56d054, null, 2) : ""));
  },
  response(_0x3a3c29, _0x5c17da, _0x285987, _0x2675e4) {
    const _0x335d81 = _0x5c17da.replace(/client_secret=([^&]+)/, "client_secret=***"),
      _0x21bc71 = {
        ..._0x2675e4
      },
      _0x38e075 = _0x21bc71;
    if (_0x38e075.token) {
      _0x38e075.token = "***";
    }
    this.debug(_0x3a3c29.toUpperCase() + " " + _0x335d81 + " - Status: " + _0x285987 + "\nResponse: " + JSON.stringify(_0x38e075, null, 2));
  }
};
class QinglongAPI {
  constructor(_0x2d66c3, _0x221d01, _0x3657a1) {
    this.url = _0x2d66c3.replace(/\/$/, "");
    this.clientId = _0x221d01;
    this.clientSecret = _0x3657a1;
    this.token = null;
    this.tokenExpireTime = null;
    this.isInitialized = false;
    this.defaultVersion = null;
  }
  async init() {
    if (this.isInitialized) {
      this.tokenExpireTime && Date.now() > this.tokenExpireTime && (logger.debug("Token已过期，重新获取"), await this.getToken());
      return;
    }
    try {
      utils.validateConfig(this);
      await utils.retry(async () => {
        await this.testConnection();
      });
      this.isInitialized = true;
    } catch (_0x4e204c) {
      logger.error("初始化失败", _0x4e204c);
      throw new Error("面板初始化失败❌: " + _0x4e204c.message);
    }
  }
  async testConnection() {
    try {
      logger.debug("测试连接青龙面板: " + this.url);
      await this.getToken();
      const _0x1abde0 = await this.getVersion();
      logger.info("青龙面板连接正常✅: " + this.url + ", 版本: " + _0x1abde0);
      return true;
    } catch (_0x2ee3cc) {
      logger.error("青龙面板连接失败❌: " + this.url, _0x2ee3cc);
      return false;
    }
  }
  async getVersion() {
    try {
      const _0x6907ae = await axios({
        url: this.url + "/open/system",
        method: "get",
        timeout: _0x160b63.common.timeout,
        headers: {
          Authorization: "Bearer " + this.token
        }
      });
      if (_0x6907ae.data?.["data"]?.["version"]) {
        return _0x6907ae.data.data.version;
      }
      const _0x2d9f1b = await axios({
        url: this.url + "/open/version",
        method: "get",
        timeout: _0x160b63.common.timeout
      });
      if (_0x2d9f1b.data?.["data"]) {
        return _0x2d9f1b.data.data;
      }
      logger.info("无法获取面板版本信息，使用默认版本: " + this.defaultVersion);
      return this.defaultVersion;
    } catch (_0x595562) {
      logger.info("使用配置的默认版本: " + this.defaultVersion);
      return this.defaultVersion;
    }
  }
  async getToken() {
    return await utils.retry(async () => {
      try {
        const _0x4fb280 = this.url + "/open/auth/token",
          _0x1949a5 = {
            client_id: this.clientId,
            client_secret: this.clientSecret
          };
        logger.request("GET", _0x4fb280, _0x1949a5);
        const _0x49b52d = await axios({
          url: _0x4fb280,
          method: "get",
          params: _0x1949a5,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          timeout: _0x160b63.common.timeout
        });
        logger.response("GET", _0x4fb280, _0x49b52d.status, _0x49b52d.data);
        if (_0x49b52d.data?.["code"] === 200 && _0x49b52d.data?.["data"]?.["token"]) {
          this.token = _0x49b52d.data.data.token;
          this.tokenExpireTime = Date.now() + 3600000;
          logger.info("成功获取访问令牌✅");
          return this.token;
        }
        throw new Error(_0x49b52d.data?.["message"] || "获取令牌失败");
      } catch (_0x5a8bb5) {
        this.handleRequestError("获取令牌失败", _0x5a8bb5);
        throw _0x5a8bb5;
      }
    });
  }
  handleRequestError(_0x4a70eb, _0x52b36a) {
    if (_0x52b36a.response) {
      const _0x291e94 = _0x52b36a.response.status,
        _0xbc4db9 = _0x52b36a.response.data?.["message"] || "未知错误";
      logger.error(_0x4a70eb + ": HTTP " + _0x291e94 + " - " + _0xbc4db9, _0x52b36a);
      _0x291e94 === 401 && (this.token = null, this.tokenExpireTime = null);
    } else {
      if (_0x52b36a.request) {
        logger.error(_0x4a70eb + ": 网络请求失败", _0x52b36a);
      } else {
        logger.error(_0x4a70eb + ": " + _0x52b36a.message, _0x52b36a);
      }
    }
  }
  async makeRequest(_0x528fac, _0x4dda5b, _0x467e7e = null) {
    await this.init();
    const _0x168634 = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    this.token && (_0x168634.Authorization = "Bearer " + this.token);
    const _0x69fef1 = {
      method: _0x528fac,
      url: "" + this.url + _0x4dda5b,
      headers: _0x168634,
      timeout: _0x160b63.common.timeout
    };
    if (_0x528fac.toLowerCase() === "get") {
      _0x69fef1.params = _0x467e7e;
    } else {
      _0x467e7e && (_0x69fef1.data = _0x467e7e);
    }
    return await utils.retry(async () => {
      try {
        logger.request(_0x528fac, _0x69fef1.url, _0x467e7e);
        const _0x194f7e = await axios(_0x69fef1);
        logger.response(_0x528fac, _0x69fef1.url, _0x194f7e.status, _0x194f7e.data);
        if (_0x194f7e.data?.["code"] === 200) {
          return _0x194f7e.data;
        }
        throw new Error(_0x194f7e.data?.["message"] || "请求失败");
      } catch (_0x18dbb5) {
        this.handleRequestError(_0x528fac.toUpperCase() + " " + _0x4dda5b + " 失败", _0x18dbb5);
        throw _0x18dbb5;
      }
    });
  }
  async getEnvs() {
    const _0x38e56d = await this.makeRequest("get", "/open/envs");
    return _0x38e56d.data || [];
  }
  async addEnvs(_0x1c30ed) {
    const _0x5761b1 = await this.makeRequest("post", "/open/envs", _0x1c30ed);
    return _0x5761b1.data;
  }
  async enableEnvs(_0x2af745) {
    const _0x4b640a = await this.makeRequest("put", "/open/envs/enable", _0x2af745);
    return _0x4b640a.data;
  }
  async disableEnvs(_0x367b93) {
    const _0xc4db34 = await this.makeRequest("put", "/open/envs/disable", _0x367b93);
    return _0xc4db34.data;
  }
  async deleteEnvs(_0x5e44ce) {
    const _0x576ad4 = await this.makeRequest("delete", "/open/envs", _0x5e44ce);
    return _0x576ad4.data;
  }
}
class CookieManager {
  constructor(_0x25a968) {
    this.sourceQL = _0x25a968;
    this.importId = utils.generateImportId();
  }
  parseCookie(_0x483fc0) {
    try {
      if (!_0x483fc0 || typeof _0x483fc0 !== "string") {
        logger.warn("无效的Cookie格式: 不是字符串");
        return null;
      }
      const _0x138ba2 = _0x483fc0.match(/pt_key=[^;]+/),
        _0x27f47d = _0x483fc0.match(/pt_pin=[^;]+/);
      if (!_0x138ba2 || !_0x27f47d) {
        logger.warn("无效的Cookie格式: 缺少必要参数 - " + _0x483fc0);
        return null;
      }
      const _0x368c20 = _0x138ba2[0] + ";" + _0x27f47d[0] + ";",
        _0x4f8ede = decodeURIComponent(_0x27f47d[0].split("=")[1]);
      if (!_0x4f8ede || _0x4f8ede.length < 2) {
        logger.warn("无效的pin值: " + _0x4f8ede);
        return null;
      }
      return {
        cookie: _0x368c20,
        pin: _0x4f8ede,
        ptKey: _0x138ba2[0],
        ptPin: _0x27f47d[0],
        timestamp: Date.now()
      };
    } catch (_0x30f46f) {
      logger.error("解析Cookie失败", _0x30f46f);
      return null;
    }
  }
  async getValidCookies(_0x13d3bc = []) {
    try {
      const _0x16a936 = await this.sourceQL.getEnvs(),
        _0x38b964 = [],
        _0xa2a80d = {
          total: 0,
          valid: 0,
          blocked: 0,
          invalid: 0,
          disabled: 0
        };
      for (const _0xaa17b of _0x16a936) {
        if (_0xaa17b.name === "JD_COOKIE") {
          _0xa2a80d.total++;
          if (_0xaa17b.status !== 0) {
            _0xa2a80d.disabled++;
            continue;
          }
          const _0xca7ea3 = this.parseCookie(_0xaa17b.value);
          if (!_0xca7ea3) {
            _0xa2a80d.invalid++;
            continue;
          }
          if (_0x13d3bc.includes(_0xca7ea3.pin)) {
            _0xa2a80d.blocked++;
            logger.debug("已屏蔽的Cookie: " + _0xca7ea3.pin);
            continue;
          }
          _0x38b964.push(_0xca7ea3);
          _0xa2a80d.valid++;
        }
      }
      logger.info("📊 Cookie统计:\n                📌 总数: " + _0xa2a80d.total + "\n                ✅ 有效: " + _0xa2a80d.valid + "\n                🚫 已屏蔽: " + _0xa2a80d.blocked + "\n                ❌ 无效格式: " + _0xa2a80d.invalid + "\n                ⛔ 已禁用: " + _0xa2a80d.disabled);
      return _0x38b964;
    } catch (_0xdc0d0e) {
      logger.error("获取有效Cookie失败", _0xdc0d0e);
      return [];
    }
  }
  async importCookies(_0x4970d6, _0x4f0576, _0x2817c3, _0x1cf1bd) {
    const _0x409137 = {
      total: _0x4f0576.length,
      success: 0,
      reactivated: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
    try {
      const _0x5e3cae = await _0x4970d6.getEnvs(),
        _0x4662ba = new Map();
      let _0xc69461 = 0;
      for (const _0x1c2a19 of _0x5e3cae) {
        if (_0x1c2a19.name === "JD_COOKIE") {
          const _0x4720f4 = this.parseCookie(_0x1c2a19.value);
          if (_0x4720f4) {
            const _0x4525f5 = {
              id: _0x1c2a19.id,
              value: _0x1c2a19.value,
              remarks: _0x1c2a19.remarks,
              status: _0x1c2a19.status
            };
            _0x4662ba.set(_0x4720f4.pin, _0x4525f5);
            _0x1c2a19.status === 0 && _0xc69461++;
          }
        }
      }
      for (let _0x5898a4 = 0; _0x5898a4 < _0x4f0576.length; _0x5898a4 += _0x2817c3) {
        const _0x454694 = _0x4f0576.slice(_0x5898a4, _0x5898a4 + _0x2817c3),
          _0x560cfb = _0x454694.map(_0x461baa => ({
            name: "JD_COOKIE",
            value: _0x461baa.cookie,
            remarks: _0x1cf1bd + "_" + this.importId + " - " + _0x461baa.pin
          }));
        try {
          const _0x12128e = [],
            _0x105465 = [];
          for (const _0x58ee8e of _0x454694) {
            const _0x2ecbb0 = _0x4662ba.get(_0x58ee8e.pin);
            if (_0x2ecbb0) {
              if (_0x2ecbb0.value !== _0x58ee8e.cookie) {
                const _0x17b182 = {
                  pin: _0x58ee8e.pin,
                  oldId: _0x2ecbb0.id,
                  oldStatus: _0x2ecbb0.status
                };
                _0x12128e.push(_0x17b182);
                _0x105465.push(_0x2ecbb0.id);
              } else {
                if (_0x2ecbb0.status !== 0) {
                  logger.info("重新启用已禁用的Cookie: " + _0x58ee8e.pin);
                  await _0x4970d6.enableEnvs([_0x2ecbb0.id]);
                  _0x409137.reactivated++;
                } else {
                  logger.debug("跳过相同的Cookie: " + _0x58ee8e.pin);
                  _0x409137.skipped++;
                }
              }
            }
          }
          if (_0x105465.length > 0) {
            logger.info("处理" + _0x105465.length + "个需要更新的Cookie");
            await _0x4970d6.deleteEnvs(_0x105465);
            logger.info("已删除" + _0x105465.length + "个旧的Cookie");
          }
          const _0x3f4658 = _0x4f0576.length - _0xc69461;
          let _0x5f51c7 = _0x560cfb.filter(_0x8ba895 => {
            const _0x14e65d = this.parseCookie(_0x8ba895.value);
            return !_0x4662ba.has(_0x14e65d.pin) || _0x12128e.some(_0x418401 => _0x418401.pin === _0x14e65d.pin);
          });
          _0x3f4658 <= 0 ? (logger.info("已达到目标数量 " + _0x4f0576.length + "，不再添加新的Cookie"), _0x5f51c7 = []) : (_0x5f51c7 = _0x5f51c7.slice(0, _0x3f4658), logger.info("当前有效Cookie数量: " + _0xc69461 + ", 将添加 " + _0x5f51c7.length + " 个新Cookie"));
          if (_0x5f51c7.length > 0) {
            logger.info("准备添加" + _0x5f51c7.length + "个新Cookie");
            const _0x14a616 = await _0x4970d6.addEnvs(_0x5f51c7);
            if (_0x14a616) {
              const _0x361143 = Array.isArray(_0x14a616) ? _0x14a616.map(_0x4e8a64 => _0x4e8a64.id) : [_0x14a616.id];
              await _0x4970d6.enableEnvs(_0x361143);
              _0x409137.success += _0x5f51c7.length;
              logger.info("成功导入" + _0x5f51c7.length + "个Cookie");
            }
          }
        } catch (_0x123433) {
          logger.error("批量导入失败，尝试逐个导入", _0x123433);
          for (const _0x25c9cd of _0x560cfb) {
            try {
              const _0x1cfa61 = this.parseCookie(_0x25c9cd.value),
                _0xfdadb = _0x4662ba.get(_0x1cfa61.pin);
              if (_0xfdadb) {
                if (_0xfdadb.value !== _0x25c9cd.value) {
                  await _0x4970d6.deleteEnvs([_0xfdadb.id]);
                  const _0x16ae05 = await _0x4970d6.addEnvs([_0x25c9cd]);
                  if (_0x16ae05) {
                    const _0x44e3f3 = Array.isArray(_0x16ae05) ? _0x16ae05[0].id : _0x16ae05.id;
                    await _0x4970d6.enableEnvs([_0x44e3f3]);
                    _0x409137.success++;
                    logger.info("成功更新Cookie: " + _0x25c9cd.remarks);
                  }
                } else {
                  _0xfdadb.status !== 0 ? (await _0x4970d6.enableEnvs([_0xfdadb.id]), _0x409137.reactivated++, logger.info("重新启用Cookie: " + _0x25c9cd.remarks)) : (_0x409137.skipped++, logger.debug("跳过未变化的Cookie: " + _0x25c9cd.remarks));
                }
              } else {
                if (_0xc69461 < _0x4f0576.length) {
                  const _0x15f83c = await _0x4970d6.addEnvs([_0x25c9cd]);
                  if (_0x15f83c) {
                    const _0x3f68ba = Array.isArray(_0x15f83c) ? _0x15f83c[0].id : _0x15f83c.id;
                    await _0x4970d6.enableEnvs([_0x3f68ba]);
                    _0x409137.success++;
                    _0xc69461++;
                    logger.info("成功导入新Cookie: " + _0x25c9cd.remarks);
                  }
                }
              }
            } catch (_0x241c66) {
              _0x409137.failed++;
              logger.error("导入单个Cookie失败: " + _0x25c9cd.remarks, _0x241c66);
              const _0x3f37ec = {
                pin: parsed?.["pin"],
                error: _0x241c66.message
              };
              _0x409137.errors.push(_0x3f37ec);
            }
            await utils.sleep(_0x160b63.common.delayBetweenRequests);
          }
        }
        await utils.sleep(_0x160b63.common.delayBetweenRequests);
      }
    } catch (_0x32b960) {
      logger.error("导入Cookie失败", _0x32b960);
      const _0x279211 = {
        general: _0x32b960.message
      };
      _0x409137.errors.push(_0x279211);
    }
    return _0x409137;
  }
}
class CookieSelector {
  static select(_0x4bbd8e, _0x40e55c, _0x582ae5, _0x38302e) {
    try {
      logger.debug("选择Cookie: 模式=" + _0x40e55c + ", 数量=" + _0x582ae5 + ", 指定pins=" + (_0x38302e?.["length"] || 0) + "个");
      if (!Array.isArray(_0x4bbd8e) || _0x4bbd8e.length === 0) {
        logger.warn("没有可用的Cookie");
        return [];
      }
      switch (_0x40e55c) {
        case 0:
          logger.info("使用全部导入模式，共" + _0x4bbd8e.length + "个Cookie");
          return _0x4bbd8e;
        case 1:
          const _0x5bd2da = Math.min(_0x582ae5, _0x4bbd8e.length);
          logger.info("使用顺序导入模式，将导入前" + _0x5bd2da + "个Cookie");
          return _0x4bbd8e.slice(0, _0x5bd2da);
        case 2:
          const _0xc88c5b = this.shuffle(_0x4bbd8e),
            _0x538ef0 = Math.min(_0x582ae5, _0x4bbd8e.length);
          logger.info("使用随机导入模式，将随机导入" + _0x538ef0 + "个Cookie");
          return _0xc88c5b.slice(0, _0x538ef0);
        case 3:
          if (!_0x38302e?.["length"]) {
            logger.warn("使用指定pin导入模式，但未指定任何pin");
            return [];
          }
          const _0x1a8658 = _0x4bbd8e.filter(_0x17c105 => _0x38302e.includes(_0x17c105.pin));
          logger.info("使用指定pin导入模式，找到" + _0x1a8658.length + "/" + _0x38302e.length + "个指定的Cookie");
          return _0x1a8658;
        default:
          logger.warn("未知的导入模式: " + _0x40e55c + "，使用默认的顺序导入模式");
          return _0x4bbd8e.slice(0, Math.min(3, _0x4bbd8e.length));
      }
    } catch (_0x52f4e4) {
      logger.error("选择Cookie时出错", _0x52f4e4);
      return [];
    }
  }
  static shuffle(_0x2f475d) {
    const _0x15d0f3 = [..._0x2f475d];
    for (let _0x18a3fd = _0x15d0f3.length - 1; _0x18a3fd > 0; _0x18a3fd--) {
      const _0x25eb7c = Math.floor(Math.random() * (_0x18a3fd + 1));
      [_0x15d0f3[_0x18a3fd], _0x15d0f3[_0x25eb7c]] = [_0x15d0f3[_0x25eb7c], _0x15d0f3[_0x18a3fd]];
    }
    return _0x15d0f3;
  }
}
module.exports = async _0x3b4d6b => {
  const _0x210268 = {
    success: 0,
    reactivated: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };
  try {
    logger.info("开始执行Cookie转移");
    await _0x3b4d6b.reply("开始转移Cookie⚙️");
    const _0x483317 = await ConfigDB.get(),
      {
        qinglongConfigs: _0x509df7
      } = _0x483317;
    if (!_0x509df7?.["length"]) {
      logger.error("未找到有效的青龙配置");
      await _0x3b4d6b.reply("❌ 请先配置青龙面板信息");
      return;
    }
    for (const _0x1b99e8 of _0x509df7) {
      try {
        const {
            srcQinglong: _0x5e68d8,
            dstQinglongList: _0x3e9dfa,
            importSettings: _0x5cc346,
            customSettings: _0x3ceb80
          } = _0x1b99e8,
          _0x3f4190 = new QinglongAPI(_0x5e68d8.url, _0x5e68d8.clientId, _0x5e68d8.clientSecret);
        _0x3f4190.defaultVersion = _0x5e68d8.version || "2.17.9";
        const _0x2b4164 = new CookieManager(_0x3f4190),
          _0x3f8db5 = await _0x2b4164.getValidCookies(_0x5cc346.blockedPins);
        if (!_0x3f8db5.length) {
          logger.warn("源面板没有有效的Cookie");
          await _0x3b4d6b.reply("⚠️ 源面板没有有效的Cookie");
          continue;
        }
        await _0x3b4d6b.reply("🔍 从源面板获取到" + _0x3f8db5.length + "个有效Cookie");
        const _0x353d67 = CookieSelector.select(_0x3f8db5, _0x5cc346.mode, _0x5cc346.numToImport, _0x5cc346.specifiedPins);
        if (_0x353d67.length > 0) {
          await _0x3b4d6b.reply("📥 准备导入" + _0x353d67.length + "个Cookie到目标青龙面板");
          for (const _0x5d1a4d of _0x3e9dfa) {
            try {
              if (!_0x5d1a4d.enabled) {
                logger.info("目标面板已禁用，跳过: " + _0x5d1a4d.url);
                continue;
              }
              logger.info("初始化目标面板: " + _0x5d1a4d.url);
              const _0x25d2a8 = new QinglongAPI(_0x5d1a4d.url, _0x5d1a4d.clientId, _0x5d1a4d.clientSecret);
              _0x25d2a8.defaultVersion = _0x5d1a4d.version || "2.17.10";
              const _0x20e7f4 = await _0x2b4164.importCookies(_0x25d2a8, _0x353d67, _0x5cc346.batchSize, _0x3ceb80.userName);
              _0x210268.success += _0x20e7f4.success;
              _0x210268.reactivated += _0x20e7f4.reactivated;
              _0x210268.failed += _0x20e7f4.failed;
              _0x210268.skipped += _0x20e7f4.skipped;
              _0x210268.errors.push(..._0x20e7f4.errors);
              let _0x4f9997 = "📋 面板处理结果:\n";
              const _0x1c7b1a = [];
              if (_0x20e7f4.success > 0) {
                _0x1c7b1a.push("✅ 新导入: " + _0x20e7f4.success + " 个");
              }
              _0x20e7f4.reactivated > 0 && _0x1c7b1a.push("🔄 重新启用: " + _0x20e7f4.reactivated + " 个");
              if (_0x20e7f4.skipped > 0) {
                _0x1c7b1a.push("⏭️ 无需更新: " + _0x20e7f4.skipped + " 个");
              }
              _0x20e7f4.failed > 0 && _0x1c7b1a.push("❌ 失败: " + _0x20e7f4.failed + " 个");
              _0x1c7b1a.length > 0 ? (_0x4f9997 += _0x1c7b1a.join("\n"), _0x4f9997 += "\n📝 导入备注: " + _0x3ceb80.userName, await _0x3b4d6b.reply(_0x4f9997)) : await _0x3b4d6b.reply("ℹ️ 目标面板已达到设定数量限制，无需导入新Cookie");
              _0x20e7f4.errors.length > 0 && logger.error("导入过程中出现以下错误:", _0x20e7f4.errors);
            } catch (_0x210d0b) {
              _0x210268.failed++;
              const _0x1d5dd0 = {
                panel: _0x5d1a4d.url,
                error: _0x210d0b.message
              };
              _0x210268.errors.push(_0x1d5dd0);
              logger.error("处理目标面板失败: " + _0x5d1a4d.url, _0x210d0b);
              await _0x3b4d6b.reply("❌ 处理目标面板失败: " + _0x210d0b.message);
            }
          }
        } else {
          logger.warn("没有找到符合条件的Cookie");
          await _0x3b4d6b.reply("⚠️ 没有找到符合条件的Cookie进行导入");
        }
      } catch (_0x3c5707) {
        const _0x2a2b0d = {
          config: _0x1b99e8.srcQinglong.url,
          error: _0x3c5707.message
        };
        _0x210268.errors.push(_0x2a2b0d);
        logger.error("处理配置项失败", _0x3c5707);
        await _0x3b4d6b.reply("❌ 处理失败: " + _0x3c5707.message);
      }
    }
    let _0xf81e29 = "🎉 Cookie转移任务执行完成\n";
    const _0x34a514 = [];
    _0x210268.success > 0 && _0x34a514.push("✅ 总计新导入: " + _0x210268.success + " 个");
    _0x210268.reactivated > 0 && _0x34a514.push("🔄 总计重新启用: " + _0x210268.reactivated + " 个");
    _0x210268.skipped > 0 && _0x34a514.push("⏭️ 总计无需更新: " + _0x210268.skipped + " 个");
    _0x210268.failed > 0 && _0x34a514.push("❌ 总计失败: " + _0x210268.failed + " 个");
    if (_0x34a514.length > 0) {
      _0xf81e29 += _0x34a514.join("\n");
    } else {
      _0xf81e29 += "无需进行任何更新";
    }
    _0x210268.errors.length > 0 && (_0xf81e29 += "\n❗ 存在" + _0x210268.errors.length + "个错误");
    logger.info(_0xf81e29);
    await _0x3b4d6b.reply(_0xf81e29);
  } catch (_0x24e9d8) {
    logger.error("执行失败", _0x24e9d8);
    await _0x3b4d6b.reply("❌ 执行失败: " + _0x24e9d8.message);
  }
};