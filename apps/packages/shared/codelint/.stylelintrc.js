module.exports = {
	extends: [
		"stylelint-config-standard"
	],
	plugins: ["stylelint-order"],
	rules: {
		//指定缩进
		"indentation": 2,
		//限制相邻空行的数量
		"max-empty-lines": 1,
		//不允许末尾有多余空行
		"no-eol-whitespace": true,
		//禁止缺少文件末尾的换行符
		"no-missing-end-of-source-newline": null,
		//禁止使用未知的 at 规则
		"at-rule-no-unknown": null,
		//禁止使用未知单位
		"unit-no-unknown": [true, { "ignoreUnits": ["rpx"] }],
		//属性值0后面不加单位
		"length-zero-no-unit": true,
		//十六进制颜色缩写
		"color-hex-length": "short",
		//禁止低优先级的选择器出现在高优先级的选择器之后。
		"no-descending-specificity": true,
		//在一个样式表中禁止出现重复的选择器。
		"no-duplicate-selectors": true,
		//禁止空选择器
		"selector-no-empty": true,
		//禁止出现空快
		"block-no-empty": true,
		// 在结尾 "}" 之前不允许有空行
		"block-closing-brace-empty-line-before": ["never"],
		//注：在编写calc()函数语法时,必须在每个操作之间包含空格,特别是在使用+和-操作符时,否则表达式将无效
		//禁止在 calc 函数内使用不加空格的操作符
		"function-calc-no-unspaced-operator": true,
		//禁用未知的类型选择器。
		'selector-type-no-unknown': [true, { 'ignoreTypes': ['/^page/'] }],
		//命名规则校验  先屏蔽掉 因为ui组件库的样式覆盖 无法避免则规则
		// "selector-class-pattern": [
		//     "^([a-z][a-z0-9]*)(_[a-z0-9]+)*$",
		//     {
		//         "message": "Expected class selector to be kebab-case"
		//     }
		// ],
		//css排序规则
		"order/properties-order": [
			"position",
			"top",
			"right",
			"bottom",
			"left",
			"z-index",
			"display",
			"flex",
			"flex-flow",
			"flex-direction",
			"flex-wrap",
			"justify-content",
			"align-items",
			"align-content",
			"align-self",
			"float",
			"overflow",
			"overflow-x",
			"overflow-y",
			"margin",
			"margin-top",
			"margin-right",
			"margin-bottom",
			"margin-left",
			"padding",
			"padding-top",
			"padding-right",
			"padding-bottom",
			"padding-left",
			"width",
			"min-width",
			"max-width",
			"height",
			"min-height",
			"max-height",
			"font-size",
			"font-family",
			"font-weight",
			"border",
			"border-style",
			"border-width",
			"border-color",
			"border-top",
			"border-top-style",
			"border-top-width",
			"border-top-color",
			"border-right",
			"border-right-style",
			"border-right-width",
			"border-right-color",
			"border-bottom",
			"border-bottom-style",
			"border-bottom-width",
			"border-bottom-color",
			"border-left",
			"border-left-style",
			"border-left-width",
			"border-left-color",
			"border-radius",
			"text-align",
			"text-justify",
			"text-indent",
			"text-overflow",
			"text-decoration",
			"white-space",
			"color",
			"background",
			"background-position",
			"background-repeat",
			"background-size",
			"background-color",
			"background-clip",
			"opacity",
			"filter",
			"list-style",
			"outline",
			"visibility",
			"box-shadow",
			"text-shadow",
			"resize",
			"transition"
		]
	}
}
