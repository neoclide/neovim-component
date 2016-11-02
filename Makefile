
watch:
	@chokidar 'src/**/*.ts' -c 'npm run build ;and date ;and growlnotify -m rebuild'

.PHONY: watch
