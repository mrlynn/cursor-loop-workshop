INTERVENTIONS ?= 0
PASS ?= true
ITERS ?= 4
LAB ?= ../atlas-oms
WORKSHOP ?= $(HOME)/code/loop-workshop

help:
	@echo "Loop Engineering — common targets"
	@echo ""
	@echo "  make setup              Clone workshop + lab repos to WORKSHOP=$(WORKSHOP)"
	@echo "  make harness LAB=path   Copy .cursor harness into lab repo"
	@echo "  make plugin             Build plugin/ bundle from .cursor"
	@echo "  make install-plugin     Symlink plugin to ~/.cursor/plugins/local/"
	@echo "  make prompt TASK=id     Print Agent prompt for task"
	@echo "  make prompt-copy TASK=id  Copy prompt to clipboard (macOS)"
	@echo "  make loop TASK=id PASS=true ITERS=4  Log manual B-arm metrics"
	@echo "  make scaffold           Interactive BYO task YAML"
	@echo "  make site               npm start in site/"
	@echo "  make site-build         Production build"

setup:
	chmod +x scripts/*.sh
	./scripts/setup-workshop.sh $(WORKSHOP)

harness:
	chmod +x scripts/*.sh
	./scripts/copy-harness.sh $(LAB)

plugin: build-plugin

build-plugin:
	chmod +x scripts/*.sh
	./scripts/build-plugin.sh

install-plugin: build-plugin
	mkdir -p $(HOME)/.cursor/plugins/local
	ln -sfn $(CURDIR)/plugin $(HOME)/.cursor/plugins/local/loop-engineering
	@echo "Installed → ~/.cursor/plugins/local/loop-engineering (restart Cursor)"

prompt:
	./scripts/task-prompt.sh $(TASK)

prompt-copy:
	./scripts/task-prompt.sh $(TASK) --copy

loop:
	./scripts/loop-harness.sh --task $(TASK) --method B \
		--log-only --pass $(PASS) --iterations $(ITERS) \
		--interventions $(INTERVENTIONS) \
		--log loop-runs/$(TASK)-$$(date +%s).json

scaffold:
	./scripts/scaffold-byo-task.sh

site:
	cd site && npm install && npm run start

site-build:
	cd site && npm run build
