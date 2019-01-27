"use strict";

// 是否闰年
function isLeapYear(year) {
    return (year % 400 === 0 || year % 4 === 0 && year % 100 !== 0);
}

// 获取某一年天数
function daysOfYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

// 获取某年某月天数
// month 取值范围 0~11
function daysOfMonth(year, month) {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (0 <= month && 11 >= month) {
        if (1 === month && isLeapYear(year)) {
            return 29;
        }
        return days[month];
    }
    return void 0;
}

// 获取某一年有多少周
// firstDayOfWeek，一周的第一天，周一为1，周日为0
function weeksOfYear(year, firstDayOfWeek) {
    firstDayOfWeek = firstDayOfWeek % 7;
    const firstDay = new Date(year, 0, 1);
    const addDays = (firstDay.getDay() + 7 - firstDayOfWeek) % 7;
    return Math.ceil((daysOfYear(year) + addDays) / 7);
}

// 创建SVG元素
function createSvgElement(qualifiedName) {
    return document.createElementNS("http://www.w3.org/2000/svg", qualifiedName);
}

// SVG tooltip
function showTooltip(evt) {
    hideTooltip();

    const rect = evt.target;
    const e = document.createElement("div");
    e.setAttribute("id", "svg-tooltip");
    e.innerHTML = rect.getAttribute("data-date");
    e.classList.add("svg-tip", "svg-tip-one-line");
    e.style.display = "block";
    e.style.position = "absolute";
    e.style.left = evt.pageX - 40 + 'px';
    e.style.top = evt.pageY - 40 + 'px';

    document.body.appendChild(e);
}

function hideTooltip() {
    const e = document.getElementById("svg-tooltip");
    e && e.remove();
}

// 响应SVG rect click事件
function onSvgRectClick(evt) {
    if (bgColor) {
        evt.target.setAttribute("fill", bgColor);
    } else {
        alert("请选择背景色！");
    }
}

// 生成提交矩阵
function drawContributeMatrix(rows, cols, dateMatrix) {
    let svg = createSvgElement("svg");
    svg.setAttribute("width", "673");
    svg.setAttribute("height", "104");

    let root = createSvgElement("g");
    root.setAttribute("transform", "translate(20, 20)");

    // 月份标记横坐标位置
    let monthPositions = new Array(12);

    for (let c = 0; c < cols; c++) {
        let g = createSvgElement("g");
        let xPos = 1 + 12 * c;
        g.setAttribute("transform", "translate(" + xPos + ", 0)");

        for (let r = 0; r < rows; r++) {
            let rect = createSvgElement("rect");

            if (dateMatrix) {
                let date = dateMatrix[c][r];
                if (date) {
                    if (date.getDate() === 1) {
                        monthPositions[date.getMonth()] = xPos + 12;
                    }
                    rect.setAttribute("data-date", date.format("yyyy-MM-dd"));
                    rect.addEventListener("mousemove", function (evt) {
                        showTooltip(evt);
                    });
                    rect.addEventListener("mouseout", function () {
                        hideTooltip();
                    });
                    rect.addEventListener("click", function (evt) {
                        onSvgRectClick(evt);
                    });
                } else {
                    continue;
                }
            }
            rect.setAttribute("id", "rect" + (c * rows + r));
            rect.setAttribute("class", "day");
            rect.setAttribute("width", "10");
            rect.setAttribute("height", "10");
            rect.setAttribute("x", "12");
            rect.setAttribute("y", "" + 12 * r);
            rect.setAttribute("fill", "#ebedf0");
            // rect.setAttribute("data-count", "0");
            g.appendChild(rect);
        }

        root.appendChild(g);
    }

    // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    for (let i = 0; i < months.length; i++) {
        let text = createSvgElement("text");
        text.setAttribute("class", "month");
        text.setAttribute("x", monthPositions[i]);
        // text.setAttribute("x", 25 + 48 * i);
        text.setAttribute("y", "-10");
        text.innerHTML = months[i];

        root.appendChild(text);
    }

    // const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    for (let i = 0; i < weeks.length; i++) {
        if (i % 2 === 0) {
            continue;
        }
        let text = createSvgElement("text");
        text.setAttribute("class", "weekday");
        text.setAttribute("dx", "-18");
        text.setAttribute("dy", 7 + 12 * i);
        text.innerHTML = weeks[i];

        root.appendChild(text);
    }

    svg.appendChild(root);
    return svg;
}

// 日期格式化
Date.prototype.format = function (fmt) {
    const o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

// 获取指定年份日期矩阵
function getDateMatrix(year, firstDayOfWeek, rows, cols) {
    let matrix = new Array(cols);
    for (let c = 0; c < cols; c++) {
        matrix[c] = new Array(7);
    }

    let date = new Date(year, 0, 1);
    let index = (date.getDay() + 7 - firstDayOfWeek) % 7;
    for (let m = 0; m < 12; m++) {
        let days = daysOfMonth(year, m);
        for (let d = 1; d <= days; d++) {
            matrix[Math.floor(index / rows)][index % rows] = new Date(year, m, d);
            index++;
        }
    }

    return matrix;
}

// 获取图例元素
function getLegendElement() {
    return document.getElementById("js-legend");
}

// 设置填充背景色
function setBackgroundColor(index) {
    bgColor = colors[index];

    const ul = getLegendElement();
    if (ul) {
        const liarr = ul.getElementsByTagName("li");
        for (let i = 0; i < liarr.length; i++) {
            const classList = liarr[i].classList;
            if (i === index) {
                classList.remove("normal");
                classList.add("selected");
            } else {
                classList.remove("selected");
                classList.add("normal");
            }
        }
    }
}

// 添加图例及处理事件
function addLegend() {
    const ul = getLegendElement();
    if (ul) {
        for (let i = 0; i < colors.length; i++) {
            let li = document.createElement("li");
            li.style.backgroundColor = colors[i];
            li.classList.add("normal");
            li.addEventListener("click", function () {
                setBackgroundColor(i);
            });

            ul.appendChild(li);
        }
    }
}

// 生成UUID v4
function uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
            return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
        }
    )
}

// 导出日期与颜色数据
function exportSchedule() {
    const days = document.getElementsByClassName("day");
    if (days) {
        let exportFilename = document.getElementById("export-filename").value || "contribution.ics";
        if (!exportFilename.endsWith(".ics")) {
            exportFilename = exportFilename.concat(".ics");
        }

        let ical = new ICAL.Component(["vcalendar", [], []]);
        for (let i = 0; i < days.length; i++) {
            let date = days[i].getAttribute("data-date");
            let count = colors.indexOf(days[i].getAttribute("fill"));
            if (count > 0) {
                let vevent = new ICAL.Component("vevent");
                let event = new ICAL.Event(vevent);
                event.summary = "要努力向 GitHub 提交 " + (count >= 4 ? "4 次及以上哦！" : count + " 次哦！");
                event.location = "GitHub";
                event.description = "由 " + window.location.origin + window.location.pathname + " 提供定制服务";
                event.uid = uuid().toLocaleUpperCase();
                event.startDate = ICAL.Time.fromDateTimeString(date + "T09:00:00");
                event.endDate = ICAL.Time.fromDateTimeString(date + "T10:00:00");

                let valarm = new ICAL.Component("valarm");
                valarm.addPropertyWithValue("action", "DISPLAY");
                valarm.addPropertyWithValue("trigger", ICAL.Duration.fromSeconds(-300));
                valarm.addPropertyWithValue("description", "Reminder");

                vevent.addSubcomponent(valarm);
                ical.addSubcomponent(vevent);
            }
        }

        if (ical.getAllSubcomponents().length > 0) {
            let contributionData = ical.toString();
            let blob = new Blob([contributionData], {type: "text/plain;charset=utf-8"});
            saveAs(blob, exportFilename);
        } else {
            alert("无数据！");
        }
    }
}

// 导入提交计划
function importData(event) {
    let selectedFile = event.target.files[0];
    if (selectedFile) {
        document.getElementById("import-filename").innerHTML = selectedFile.name;

        let reader = new FileReader();
        reader.onload = function () {
            let ical = ICAL.parse(reader.result);
            let contribution = new ICAL.Component(ical).getAllSubcomponents("vevent");
            if (contribution) {
                let dateCountDic = [];
                for (let i = 0; i < contribution.length; i++) {
                    let data = new ICAL.Event(contribution[i]);
                    let date = new Date(data.startDate.year, data.startDate.month - 1, data.startDate.day);
                    let matches = /\d+/.exec(data.summary);
                    if (matches) {
                        let count = parseInt(matches[0]);
                        if (count < 0) {
                            count = 0;
                        } else if (count > 4) {
                            count = 4;
                        }
                        dateCountDic[date.format("yyyy-MM-dd")] = count;
                    }
                }

                const days = document.getElementsByClassName("day");
                if (days) {
                    for (let i = 0; i < days.length; i++) {
                        let date = days[i].getAttribute("data-date");
                        if (dateCountDic[date]) {
                            days[i].setAttribute("fill", colors[dateCountDic[date]]);
                        }
                    }
                }
            }
        };
        reader.readAsText(selectedFile, "utf-8");
    }
}

// 导入提交计划
function importSchedule() {
    document.getElementById("files").click();
}

function main() {
    // 添加图例
    addLegend();

    const thisYear = new Date().getFullYear();
    // 得到今年有多少周
    const weeksOfThisYear = weeksOfYear(thisYear, 0);
    // 创建日期矩阵
    const dateMatrix = getDateMatrix(thisYear, 0, 7, weeksOfThisYear);
    // 生成SVG图元
    const svg = drawContributeMatrix(7, weeksOfThisYear, dateMatrix);

    const contribute = document.getElementById("contribution");
    // contribute.innerHTML = svg.outerHTML;
    contribute.appendChild(svg);
}

// 图例
const colors = ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"];
let bgColor = void 0;
main();
