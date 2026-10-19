var rule = {
  title: '花都动漫',
  host: 'https://hd.huadudm.com',
  url: '/vodshow/fyclass--------fypage---.html',
  searchUrl: '/vodsearch/**----------fypage---.html',
  searchable: 2,
  quickSearch: 1,
  filterable: 0,
  multi: 1,
  class_name: '中文字幕&无字幕&国产&欧美&动漫&中字有码&骑兵有码&中字无码&步兵无码&国产精品&国产传媒&欧美中字&糖心Vlog&中字里番&3D动漫&AI短剧',
  class_url: '1&2&3&4&5&6&7&8&9&10&11&12&13&14&15&16',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://hd.huadudm.com/'
  },
  play_parse: true,
  limit: 20,
  推荐: '*',
  一级: 'ul.stui-vodlist li;h4.title&&a&&title;img&&data-original;span.pic-text&&Text;a&&href',
  二级: {
    title: 'h1&&Text',
    img: 'div.stui-content__thumb img&&data-original',
    desc: 'div.detail-item:contains(分类) span.detail-content&&Text;div.detail-item:contains(日期) span.detail-content&&Text;div.detail-item:contains(时长) span.detail-content&&Text',
    content: 'meta[name="description"]&&content',
    tabs: 'div.stui-pannel__head',
    lists: 'ul.stui-content__playlist:eq(#id) a'
  },
  搜索: 'ul.stui-vodlist li;h4.title&&a&&title;img&&data-original;span.pic-text&&Text;a&&href',
  lazy: `js:
    let html = request(input, {headers: rule.headers});
    let m = html.match(/var\\s+player_data\\s*=\\s*([\\s\\S]*?)<\\/script>/i);
    if (!m) throw new Error('未找到 player_data；请检查播放页是否能正常打开');
    let raw = m[1].replace(/;\\s*$/, '').trim();
    let d;
    try { d = JSON.parse(raw); } catch (e) {
      let mm = raw.match(/\\{[\\s\\S]*\\}/);
      if (mm) { try { d = JSON.parse(mm[0]); } catch (e2) {} }
    }
    if (!d || !d.url) throw new Error('播放页没有有效的 player_data.url');
    let u = String(d.url).trim();
    let enc = String(d.encrypt || '');
    function decodeB64(s) {
      let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      let out = '', buffer = 0, bits = 0;
      s = String(s).replace(/[^A-Za-z0-9+\\/=]/g, '');
      for (let j = 0; j < s.length; j++) {
        let v = chars.indexOf(s.charAt(j));
        if (v < 0 || v === 64) break;
        buffer = (buffer << 6) | v; bits += 6;
        if (bits >= 8) { bits -= 8; out += String.fromCharCode((buffer >> bits) & 255); }
      }
      try { return decodeURIComponent(escape(out)); } catch (e) { return out; }
    }
    if (enc === '1') {
      try { u = unescape(u); } catch (e) {}
    } else if (enc === '2') {
      u = decodeB64(u);
      for (let i = 0; i < 8; i++) {
        let next = u;
        try { next = decodeURIComponent(u); } catch (e) {}
        if (next === u) break;
        u = next;
      }
    }
    if (!/^https?:\\/\\//i.test(u)) throw new Error('播放地址解码后不是 http/https 地址：' + u.slice(0, 80));
    input = u;
  `
};
