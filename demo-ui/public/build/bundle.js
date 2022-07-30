
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function _mergeNamespaces(n, m) {
        m.forEach(function (e) {
            e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
                if (k !== 'default' && !(k in n)) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        });
        return Object.freeze(n);
    }

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src\MimeTypes.svelte generated by Svelte v3.49.0 */

    function isMimeTypeImage(mt) {
    	return mt.startsWith("image/");
    }

    function isMimeTypeVideo(mt) {
    	return mt.startsWith("video/");
    }

    function isMimeTypeAudio(mt) {
    	return mt.startsWith("audio/");
    }

    function isMimeTypeText(mt) {
    	return mt.startsWith("text/");
    }

    function isMimeTypePDF(mt) {
    	return mt == "application/pdf";
    }

    function isMimeTypeSupported(mt) {
    	return isMimeTypeImage(mt) || isMimeTypeVideo(mt) || isMimeTypeAudio(mt) || isMimeTypePDF(mt) || isMimeTypeText(mt);
    }

    function getIcon(mimeType, isLink) {
    	const icon = mimeType == "#directory"
    	? "file-manager"
    	: isMimeTypeImage(mimeType)
    		? "image-x-generic"
    		: isMimeTypeVideo(mimeType)
    			? "video-x-generic"
    			: isMimeTypeAudio(mimeType)
    				? "audio-x-generic"
    				: isMimeTypeText(mimeType)
    					? "text-x-generic"
    					: isMimeTypePDF(mimeType)
    						? "application-pdf"
    						: "application-octet-stream"; // this is also for links

    	return mimeType == "#unresolved"
    	? [icon, "invalidLink", "🔗 "]
    	: isLink ? [icon, "link", "🔗 "] : [icon, null, ""];
    }

    /* src\Struct.svelte generated by Svelte v3.49.0 */

    function sortDirs(f1, f2) {
    	const f1Dir = f1.mimeType === "#directory";
    	const f2Dir = f2.mimeType === "#directory";
    	return f1Dir == f2Dir ? 0 : f2Dir ? 1 : -1;
    }

    class ConfigSharing {
    	constructor(allowRW, profiles) {
    		this.allowRW = allowRW;
    		this.profiles = profiles;
    	}
    }

    class Config {
    	constructor(version, title, readOnly, maxReqSize, hasPassword, sharing) {
    		this.version = version;
    		this.title = title;
    		this.readOnly = readOnly;
    		this.maxReqSize = maxReqSize;
    		this.hasPassword = hasPassword;
    		this.sharing = sharing;
    	}

    	static empty() {
    		return new Config("", "", false, -1, false, null);
    	}

    	static fromAny(obj) {
    		const sharing = obj.sharing == null
    		? null
    		: new ConfigSharing(obj.sharing.allowRW, obj.sharing.profiles);

    		return new Config(obj.version, obj.title, obj.readOnly, obj.maxReqSize, obj.hasPassword, sharing);
    	}
    }

    class File {
    	constructor(isLink, mimeType, name, size, chDate, owner, group, permissions, path) {
    		this.uuid = Math.random().toString().substring(2);
    		this.mimeType = mimeType;
    		this.isDir = mimeType == "#directory";
    		this.isRoot = this.isDir && this.name == "..";
    		this.isLink = isLink;
    		this.icon = getIcon(this.mimeType, this.isLink);
    		this.name = name + (this.isDir ? "/" : "");
    		this.size = formatBytes(size);
    		this.numSize = size;
    		this.chDate = new Date(chDate * 1000).toLocaleString();
    		this.numChDate = chDate;
    		this.owner = owner;
    		this.group = group;
    		this.permissions = permissions;
    		this.path = path.join("") + this.name;

    		// Adapted from
    		// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    		function formatBytes(bytes, decimals = 2) {
    			if (bytes < 0) return "";
    			if (bytes === 0) return "0 b";
    			const k = 1024;
    			const dm = decimals < 0 ? 0 : decimals;
    			const sizes = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
    			const i = Math.floor(Math.log(bytes) / Math.log(k));
    			return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    		}
    	}

    	getWS(forDl = false) {
    		return "testFs/" + this.path;
    	}
    }

    const SORTERS = {
    	ABC(f1, f2) {
    		const fromDir = sortDirs(f1, f2);
    		return fromDir == 0 ? f1.name.localeCompare(f2.name) : fromDir;
    	},
    	CBA(f1, f2) {
    		const fromDir = sortDirs(f1, f2);
    		return fromDir == 0 ? f2.name.localeCompare(f1.name) : fromDir;
    	},
    	OldFirst(f1, f2) {
    		const fromDir = sortDirs(f1, f2);

    		return fromDir == 0
    		? Math.sign(f1.numChDate - f2.numChDate)
    		: fromDir;
    	},
    	OldLast(f1, f2) {
    		const fromDir = sortDirs(f1, f2);

    		return fromDir == 0
    		? Math.sign(f2.numChDate - f1.numChDate)
    		: fromDir;
    	},
    	SmallFirst(f1, f2) {
    		const fromDir = sortDirs(f1, f2);

    		return fromDir == 0
    		? Math.sign(f1.numSize - f2.numSize)
    		: fromDir;
    	},
    	SmallLast(f1, f2) {
    		const fromDir = sortDirs(f1, f2);

    		return fromDir == 0
    		? Math.sign(f2.numSize - f1.numSize)
    		: fromDir;
    	}
    };

    class Mule {
    	constructor(items, path) {
    		this.items = [];
    		this.files = []; // without dirs

    		for (let i = 0; i < items.length; i++) {
    			const nf = new File(items[i].isLink, items[i].mimeType, items[i].name, items[i].size, items[i].chDate, items[i].owner, items[i].group, items[i].permissions, path);
    			this.items.push(nf);

    			if (!nf.isDir) {
    				this.files.push(nf);
    			}
    		}

    		if (path.length > 0) {
    			// Is not root
    			this.items.unshift(new File(false, "#directory", "..", -1, 0, "--", "--", "--", path));
    		}
    	}

    	sort(sorter) {
    		this.items.sort(sorter);
    		this.files.sort(sorter);
    		return this;
    	}

    	static empty() {
    		return new Mule([], []);
    	}

    	static fromAny(obj, path) {
    		return new Mule(obj.items, path);
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*! Hammer.JS - v2.0.7 - 2016-04-22
     * http://hammerjs.github.io/
     *
     * Copyright (c) 2016 Jorik Tangelder;
     * Licensed under the MIT license */

    var hammer = createCommonjsModule(function (module) {
    (function(window, document, exportName, undefined$1) {

    var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
    var TEST_ELEMENT = document.createElement('div');

    var TYPE_FUNCTION = 'function';

    var round = Math.round;
    var abs = Math.abs;
    var now = Date.now;

    /**
     * set a timeout with a given scope
     * @param {Function} fn
     * @param {Number} timeout
     * @param {Object} context
     * @returns {number}
     */
    function setTimeoutContext(fn, timeout, context) {
        return setTimeout(bindFn(fn, context), timeout);
    }

    /**
     * if the argument is an array, we want to execute the fn on each entry
     * if it aint an array we don't want to do a thing.
     * this is used by all the methods that accept a single and array argument.
     * @param {*|Array} arg
     * @param {String} fn
     * @param {Object} [context]
     * @returns {Boolean}
     */
    function invokeArrayArg(arg, fn, context) {
        if (Array.isArray(arg)) {
            each(arg, context[fn], context);
            return true;
        }
        return false;
    }

    /**
     * walk objects and arrays
     * @param {Object} obj
     * @param {Function} iterator
     * @param {Object} context
     */
    function each(obj, iterator, context) {
        var i;

        if (!obj) {
            return;
        }

        if (obj.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length !== undefined$1) {
            i = 0;
            while (i < obj.length) {
                iterator.call(context, obj[i], i, obj);
                i++;
            }
        } else {
            for (i in obj) {
                obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
            }
        }
    }

    /**
     * wrap a method with a deprecation warning and stack trace
     * @param {Function} method
     * @param {String} name
     * @param {String} message
     * @returns {Function} A new function wrapping the supplied method.
     */
    function deprecate(method, name, message) {
        var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
        return function() {
            var e = new Error('get-stack-trace');
            var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
                .replace(/^\s+at\s+/gm, '')
                .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

            var log = window.console && (window.console.warn || window.console.log);
            if (log) {
                log.call(window.console, deprecationMessage, stack);
            }
            return method.apply(this, arguments);
        };
    }

    /**
     * extend object.
     * means that properties in dest will be overwritten by the ones in src.
     * @param {Object} target
     * @param {...Object} objects_to_assign
     * @returns {Object} target
     */
    var assign;
    if (typeof Object.assign !== 'function') {
        assign = function assign(target) {
            if (target === undefined$1 || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined$1 && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    } else {
        assign = Object.assign;
    }

    /**
     * extend object.
     * means that properties in dest will be overwritten by the ones in src.
     * @param {Object} dest
     * @param {Object} src
     * @param {Boolean} [merge=false]
     * @returns {Object} dest
     */
    var extend = deprecate(function extend(dest, src, merge) {
        var keys = Object.keys(src);
        var i = 0;
        while (i < keys.length) {
            if (!merge || (merge && dest[keys[i]] === undefined$1)) {
                dest[keys[i]] = src[keys[i]];
            }
            i++;
        }
        return dest;
    }, 'extend', 'Use `assign`.');

    /**
     * merge the values from src in the dest.
     * means that properties that exist in dest will not be overwritten by src
     * @param {Object} dest
     * @param {Object} src
     * @returns {Object} dest
     */
    var merge = deprecate(function merge(dest, src) {
        return extend(dest, src, true);
    }, 'merge', 'Use `assign`.');

    /**
     * simple class inheritance
     * @param {Function} child
     * @param {Function} base
     * @param {Object} [properties]
     */
    function inherit(child, base, properties) {
        var baseP = base.prototype,
            childP;

        childP = child.prototype = Object.create(baseP);
        childP.constructor = child;
        childP._super = baseP;

        if (properties) {
            assign(childP, properties);
        }
    }

    /**
     * simple function bind
     * @param {Function} fn
     * @param {Object} context
     * @returns {Function}
     */
    function bindFn(fn, context) {
        return function boundFn() {
            return fn.apply(context, arguments);
        };
    }

    /**
     * let a boolean value also be a function that must return a boolean
     * this first item in args will be used as the context
     * @param {Boolean|Function} val
     * @param {Array} [args]
     * @returns {Boolean}
     */
    function boolOrFn(val, args) {
        if (typeof val == TYPE_FUNCTION) {
            return val.apply(args ? args[0] || undefined$1 : undefined$1, args);
        }
        return val;
    }

    /**
     * use the val2 when val1 is undefined
     * @param {*} val1
     * @param {*} val2
     * @returns {*}
     */
    function ifUndefined(val1, val2) {
        return (val1 === undefined$1) ? val2 : val1;
    }

    /**
     * addEventListener with multiple events at once
     * @param {EventTarget} target
     * @param {String} types
     * @param {Function} handler
     */
    function addEventListeners(target, types, handler) {
        each(splitStr(types), function(type) {
            target.addEventListener(type, handler, false);
        });
    }

    /**
     * removeEventListener with multiple events at once
     * @param {EventTarget} target
     * @param {String} types
     * @param {Function} handler
     */
    function removeEventListeners(target, types, handler) {
        each(splitStr(types), function(type) {
            target.removeEventListener(type, handler, false);
        });
    }

    /**
     * find if a node is in the given parent
     * @method hasParent
     * @param {HTMLElement} node
     * @param {HTMLElement} parent
     * @return {Boolean} found
     */
    function hasParent(node, parent) {
        while (node) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    /**
     * small indexOf wrapper
     * @param {String} str
     * @param {String} find
     * @returns {Boolean} found
     */
    function inStr(str, find) {
        return str.indexOf(find) > -1;
    }

    /**
     * split string on whitespace
     * @param {String} str
     * @returns {Array} words
     */
    function splitStr(str) {
        return str.trim().split(/\s+/g);
    }

    /**
     * find if a array contains the object using indexOf or a simple polyFill
     * @param {Array} src
     * @param {String} find
     * @param {String} [findByKey]
     * @return {Boolean|Number} false when not found, or the index
     */
    function inArray(src, find, findByKey) {
        if (src.indexOf && !findByKey) {
            return src.indexOf(find);
        } else {
            var i = 0;
            while (i < src.length) {
                if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                    return i;
                }
                i++;
            }
            return -1;
        }
    }

    /**
     * convert array-like objects to real arrays
     * @param {Object} obj
     * @returns {Array}
     */
    function toArray(obj) {
        return Array.prototype.slice.call(obj, 0);
    }

    /**
     * unique array with objects based on a key (like 'id') or just by the array's value
     * @param {Array} src [{id:1},{id:2},{id:1}]
     * @param {String} [key]
     * @param {Boolean} [sort=False]
     * @returns {Array} [{id:1},{id:2}]
     */
    function uniqueArray(src, key, sort) {
        var results = [];
        var values = [];
        var i = 0;

        while (i < src.length) {
            var val = key ? src[i][key] : src[i];
            if (inArray(values, val) < 0) {
                results.push(src[i]);
            }
            values[i] = val;
            i++;
        }

        if (sort) {
            if (!key) {
                results = results.sort();
            } else {
                results = results.sort(function sortUniqueArray(a, b) {
                    return a[key] > b[key];
                });
            }
        }

        return results;
    }

    /**
     * get the prefixed property
     * @param {Object} obj
     * @param {String} property
     * @returns {String|Undefined} prefixed
     */
    function prefixed(obj, property) {
        var prefix, prop;
        var camelProp = property[0].toUpperCase() + property.slice(1);

        var i = 0;
        while (i < VENDOR_PREFIXES.length) {
            prefix = VENDOR_PREFIXES[i];
            prop = (prefix) ? prefix + camelProp : property;

            if (prop in obj) {
                return prop;
            }
            i++;
        }
        return undefined$1;
    }

    /**
     * get a unique id
     * @returns {number} uniqueId
     */
    var _uniqueId = 1;
    function uniqueId() {
        return _uniqueId++;
    }

    /**
     * get the window object of an element
     * @param {HTMLElement} element
     * @returns {DocumentView|Window}
     */
    function getWindowForElement(element) {
        var doc = element.ownerDocument || element;
        return (doc.defaultView || doc.parentWindow || window);
    }

    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

    var SUPPORT_TOUCH = ('ontouchstart' in window);
    var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined$1;
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

    var INPUT_TYPE_TOUCH = 'touch';
    var INPUT_TYPE_PEN = 'pen';
    var INPUT_TYPE_MOUSE = 'mouse';
    var INPUT_TYPE_KINECT = 'kinect';

    var COMPUTE_INTERVAL = 25;

    var INPUT_START = 1;
    var INPUT_MOVE = 2;
    var INPUT_END = 4;
    var INPUT_CANCEL = 8;

    var DIRECTION_NONE = 1;
    var DIRECTION_LEFT = 2;
    var DIRECTION_RIGHT = 4;
    var DIRECTION_UP = 8;
    var DIRECTION_DOWN = 16;

    var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
    var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
    var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

    var PROPS_XY = ['x', 'y'];
    var PROPS_CLIENT_XY = ['clientX', 'clientY'];

    /**
     * create new input type manager
     * @param {Manager} manager
     * @param {Function} callback
     * @returns {Input}
     * @constructor
     */
    function Input(manager, callback) {
        var self = this;
        this.manager = manager;
        this.callback = callback;
        this.element = manager.element;
        this.target = manager.options.inputTarget;

        // smaller wrapper around the handler, for the scope and the enabled state of the manager,
        // so when disabled the input events are completely bypassed.
        this.domHandler = function(ev) {
            if (boolOrFn(manager.options.enable, [manager])) {
                self.handler(ev);
            }
        };

        this.init();

    }

    Input.prototype = {
        /**
         * should handle the inputEvent data and trigger the callback
         * @virtual
         */
        handler: function() { },

        /**
         * bind the events
         */
        init: function() {
            this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        },

        /**
         * unbind the events
         */
        destroy: function() {
            this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        }
    };

    /**
     * create new input type manager
     * called by the Manager constructor
     * @param {Hammer} manager
     * @returns {Input}
     */
    function createInputInstance(manager) {
        var Type;
        var inputClass = manager.options.inputClass;

        if (inputClass) {
            Type = inputClass;
        } else if (SUPPORT_POINTER_EVENTS) {
            Type = PointerEventInput;
        } else if (SUPPORT_ONLY_TOUCH) {
            Type = TouchInput;
        } else if (!SUPPORT_TOUCH) {
            Type = MouseInput;
        } else {
            Type = TouchMouseInput;
        }
        return new (Type)(manager, inputHandler);
    }

    /**
     * handle input events
     * @param {Manager} manager
     * @param {String} eventType
     * @param {Object} input
     */
    function inputHandler(manager, eventType, input) {
        var pointersLen = input.pointers.length;
        var changedPointersLen = input.changedPointers.length;
        var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
        var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

        input.isFirst = !!isFirst;
        input.isFinal = !!isFinal;

        if (isFirst) {
            manager.session = {};
        }

        // source event is the normalized value of the domEvents
        // like 'touchstart, mouseup, pointerdown'
        input.eventType = eventType;

        // compute scale, rotation etc
        computeInputData(manager, input);

        // emit secret event
        manager.emit('hammer.input', input);

        manager.recognize(input);
        manager.session.prevInput = input;
    }

    /**
     * extend the data with some usable properties like scale, rotate, velocity etc
     * @param {Object} manager
     * @param {Object} input
     */
    function computeInputData(manager, input) {
        var session = manager.session;
        var pointers = input.pointers;
        var pointersLength = pointers.length;

        // store the first input to calculate the distance and direction
        if (!session.firstInput) {
            session.firstInput = simpleCloneInputData(input);
        }

        // to compute scale and rotation we need to store the multiple touches
        if (pointersLength > 1 && !session.firstMultiple) {
            session.firstMultiple = simpleCloneInputData(input);
        } else if (pointersLength === 1) {
            session.firstMultiple = false;
        }

        var firstInput = session.firstInput;
        var firstMultiple = session.firstMultiple;
        var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

        var center = input.center = getCenter(pointers);
        input.timeStamp = now();
        input.deltaTime = input.timeStamp - firstInput.timeStamp;

        input.angle = getAngle(offsetCenter, center);
        input.distance = getDistance(offsetCenter, center);

        computeDeltaXY(session, input);
        input.offsetDirection = getDirection(input.deltaX, input.deltaY);

        var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
        input.overallVelocityX = overallVelocity.x;
        input.overallVelocityY = overallVelocity.y;
        input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

        input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
        input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

        input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
            session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

        computeIntervalInputData(session, input);

        // find the correct target
        var target = manager.element;
        if (hasParent(input.srcEvent.target, target)) {
            target = input.srcEvent.target;
        }
        input.target = target;
    }

    function computeDeltaXY(session, input) {
        var center = input.center;
        var offset = session.offsetDelta || {};
        var prevDelta = session.prevDelta || {};
        var prevInput = session.prevInput || {};

        if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
            prevDelta = session.prevDelta = {
                x: prevInput.deltaX || 0,
                y: prevInput.deltaY || 0
            };

            offset = session.offsetDelta = {
                x: center.x,
                y: center.y
            };
        }

        input.deltaX = prevDelta.x + (center.x - offset.x);
        input.deltaY = prevDelta.y + (center.y - offset.y);
    }

    /**
     * velocity is calculated every x ms
     * @param {Object} session
     * @param {Object} input
     */
    function computeIntervalInputData(session, input) {
        var last = session.lastInterval || input,
            deltaTime = input.timeStamp - last.timeStamp,
            velocity, velocityX, velocityY, direction;

        if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined$1)) {
            var deltaX = input.deltaX - last.deltaX;
            var deltaY = input.deltaY - last.deltaY;

            var v = getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
            direction = getDirection(deltaX, deltaY);

            session.lastInterval = input;
        } else {
            // use latest velocity info if it doesn't overtake a minimum period
            velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction;
        }

        input.velocity = velocity;
        input.velocityX = velocityX;
        input.velocityY = velocityY;
        input.direction = direction;
    }

    /**
     * create a simple clone from the input used for storage of firstInput and firstMultiple
     * @param {Object} input
     * @returns {Object} clonedInputData
     */
    function simpleCloneInputData(input) {
        // make a simple copy of the pointers because we will get a reference if we don't
        // we only need clientXY for the calculations
        var pointers = [];
        var i = 0;
        while (i < input.pointers.length) {
            pointers[i] = {
                clientX: round(input.pointers[i].clientX),
                clientY: round(input.pointers[i].clientY)
            };
            i++;
        }

        return {
            timeStamp: now(),
            pointers: pointers,
            center: getCenter(pointers),
            deltaX: input.deltaX,
            deltaY: input.deltaY
        };
    }

    /**
     * get the center of all the pointers
     * @param {Array} pointers
     * @return {Object} center contains `x` and `y` properties
     */
    function getCenter(pointers) {
        var pointersLength = pointers.length;

        // no need to loop when only one touch
        if (pointersLength === 1) {
            return {
                x: round(pointers[0].clientX),
                y: round(pointers[0].clientY)
            };
        }

        var x = 0, y = 0, i = 0;
        while (i < pointersLength) {
            x += pointers[i].clientX;
            y += pointers[i].clientY;
            i++;
        }

        return {
            x: round(x / pointersLength),
            y: round(y / pointersLength)
        };
    }

    /**
     * calculate the velocity between two points. unit is in px per ms.
     * @param {Number} deltaTime
     * @param {Number} x
     * @param {Number} y
     * @return {Object} velocity `x` and `y`
     */
    function getVelocity(deltaTime, x, y) {
        return {
            x: x / deltaTime || 0,
            y: y / deltaTime || 0
        };
    }

    /**
     * get the direction between two points
     * @param {Number} x
     * @param {Number} y
     * @return {Number} direction
     */
    function getDirection(x, y) {
        if (x === y) {
            return DIRECTION_NONE;
        }

        if (abs(x) >= abs(y)) {
            return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }
        return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
    }

    /**
     * calculate the absolute distance between two points
     * @param {Object} p1 {x, y}
     * @param {Object} p2 {x, y}
     * @param {Array} [props] containing x and y keys
     * @return {Number} distance
     */
    function getDistance(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]],
            y = p2[props[1]] - p1[props[1]];

        return Math.sqrt((x * x) + (y * y));
    }

    /**
     * calculate the angle between two coordinates
     * @param {Object} p1
     * @param {Object} p2
     * @param {Array} [props] containing x and y keys
     * @return {Number} angle
     */
    function getAngle(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]],
            y = p2[props[1]] - p1[props[1]];
        return Math.atan2(y, x) * 180 / Math.PI;
    }

    /**
     * calculate the rotation degrees between two pointersets
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} rotation
     */
    function getRotation(start, end) {
        return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
    }

    /**
     * calculate the scale factor between two pointersets
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} scale
     */
    function getScale(start, end) {
        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
    }

    var MOUSE_INPUT_MAP = {
        mousedown: INPUT_START,
        mousemove: INPUT_MOVE,
        mouseup: INPUT_END
    };

    var MOUSE_ELEMENT_EVENTS = 'mousedown';
    var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

    /**
     * Mouse events input
     * @constructor
     * @extends Input
     */
    function MouseInput() {
        this.evEl = MOUSE_ELEMENT_EVENTS;
        this.evWin = MOUSE_WINDOW_EVENTS;

        this.pressed = false; // mousedown state

        Input.apply(this, arguments);
    }

    inherit(MouseInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function MEhandler(ev) {
            var eventType = MOUSE_INPUT_MAP[ev.type];

            // on start we want to have the left mouse button down
            if (eventType & INPUT_START && ev.button === 0) {
                this.pressed = true;
            }

            if (eventType & INPUT_MOVE && ev.which !== 1) {
                eventType = INPUT_END;
            }

            // mouse must be down
            if (!this.pressed) {
                return;
            }

            if (eventType & INPUT_END) {
                this.pressed = false;
            }

            this.callback(this.manager, eventType, {
                pointers: [ev],
                changedPointers: [ev],
                pointerType: INPUT_TYPE_MOUSE,
                srcEvent: ev
            });
        }
    });

    var POINTER_INPUT_MAP = {
        pointerdown: INPUT_START,
        pointermove: INPUT_MOVE,
        pointerup: INPUT_END,
        pointercancel: INPUT_CANCEL,
        pointerout: INPUT_CANCEL
    };

    // in IE10 the pointer types is defined as an enum
    var IE10_POINTER_TYPE_ENUM = {
        2: INPUT_TYPE_TOUCH,
        3: INPUT_TYPE_PEN,
        4: INPUT_TYPE_MOUSE,
        5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
    };

    var POINTER_ELEMENT_EVENTS = 'pointerdown';
    var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

    // IE10 has prefixed support, and case-sensitive
    if (window.MSPointerEvent && !window.PointerEvent) {
        POINTER_ELEMENT_EVENTS = 'MSPointerDown';
        POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
    }

    /**
     * Pointer events input
     * @constructor
     * @extends Input
     */
    function PointerEventInput() {
        this.evEl = POINTER_ELEMENT_EVENTS;
        this.evWin = POINTER_WINDOW_EVENTS;

        Input.apply(this, arguments);

        this.store = (this.manager.session.pointerEvents = []);
    }

    inherit(PointerEventInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function PEhandler(ev) {
            var store = this.store;
            var removePointer = false;

            var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
            var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
            var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

            var isTouch = (pointerType == INPUT_TYPE_TOUCH);

            // get index of the event in the store
            var storeIndex = inArray(store, ev.pointerId, 'pointerId');

            // start and mouse must be down
            if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
                if (storeIndex < 0) {
                    store.push(ev);
                    storeIndex = store.length - 1;
                }
            } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
                removePointer = true;
            }

            // it not found, so the pointer hasn't been down (so it's probably a hover)
            if (storeIndex < 0) {
                return;
            }

            // update the event in the store
            store[storeIndex] = ev;

            this.callback(this.manager, eventType, {
                pointers: store,
                changedPointers: [ev],
                pointerType: pointerType,
                srcEvent: ev
            });

            if (removePointer) {
                // remove from the store
                store.splice(storeIndex, 1);
            }
        }
    });

    var SINGLE_TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
    };

    var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
    var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

    /**
     * Touch events input
     * @constructor
     * @extends Input
     */
    function SingleTouchInput() {
        this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
        this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
        this.started = false;

        Input.apply(this, arguments);
    }

    inherit(SingleTouchInput, Input, {
        handler: function TEhandler(ev) {
            var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

            // should we handle the touch events?
            if (type === INPUT_START) {
                this.started = true;
            }

            if (!this.started) {
                return;
            }

            var touches = normalizeSingleTouches.call(this, ev, type);

            // when done, reset the started state
            if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
                this.started = false;
            }

            this.callback(this.manager, type, {
                pointers: touches[0],
                changedPointers: touches[1],
                pointerType: INPUT_TYPE_TOUCH,
                srcEvent: ev
            });
        }
    });

    /**
     * @this {TouchInput}
     * @param {Object} ev
     * @param {Number} type flag
     * @returns {undefined|Array} [all, changed]
     */
    function normalizeSingleTouches(ev, type) {
        var all = toArray(ev.touches);
        var changed = toArray(ev.changedTouches);

        if (type & (INPUT_END | INPUT_CANCEL)) {
            all = uniqueArray(all.concat(changed), 'identifier', true);
        }

        return [all, changed];
    }

    var TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
    };

    var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

    /**
     * Multi-user touch events input
     * @constructor
     * @extends Input
     */
    function TouchInput() {
        this.evTarget = TOUCH_TARGET_EVENTS;
        this.targetIds = {};

        Input.apply(this, arguments);
    }

    inherit(TouchInput, Input, {
        handler: function MTEhandler(ev) {
            var type = TOUCH_INPUT_MAP[ev.type];
            var touches = getTouches.call(this, ev, type);
            if (!touches) {
                return;
            }

            this.callback(this.manager, type, {
                pointers: touches[0],
                changedPointers: touches[1],
                pointerType: INPUT_TYPE_TOUCH,
                srcEvent: ev
            });
        }
    });

    /**
     * @this {TouchInput}
     * @param {Object} ev
     * @param {Number} type flag
     * @returns {undefined|Array} [all, changed]
     */
    function getTouches(ev, type) {
        var allTouches = toArray(ev.touches);
        var targetIds = this.targetIds;

        // when there is only one touch, the process can be simplified
        if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches];
        }

        var i,
            targetTouches,
            changedTouches = toArray(ev.changedTouches),
            changedTargetTouches = [],
            target = this.target;

        // get target touches from touches
        targetTouches = allTouches.filter(function(touch) {
            return hasParent(touch.target, target);
        });

        // collect touches
        if (type === INPUT_START) {
            i = 0;
            while (i < targetTouches.length) {
                targetIds[targetTouches[i].identifier] = true;
                i++;
            }
        }

        // filter changed touches to only contain touches that exist in the collected target ids
        i = 0;
        while (i < changedTouches.length) {
            if (targetIds[changedTouches[i].identifier]) {
                changedTargetTouches.push(changedTouches[i]);
            }

            // cleanup removed touches
            if (type & (INPUT_END | INPUT_CANCEL)) {
                delete targetIds[changedTouches[i].identifier];
            }
            i++;
        }

        if (!changedTargetTouches.length) {
            return;
        }

        return [
            // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
            uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
            changedTargetTouches
        ];
    }

    /**
     * Combined touch and mouse input
     *
     * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
     * This because touch devices also emit mouse events while doing a touch.
     *
     * @constructor
     * @extends Input
     */

    var DEDUP_TIMEOUT = 2500;
    var DEDUP_DISTANCE = 25;

    function TouchMouseInput() {
        Input.apply(this, arguments);

        var handler = bindFn(this.handler, this);
        this.touch = new TouchInput(this.manager, handler);
        this.mouse = new MouseInput(this.manager, handler);

        this.primaryTouch = null;
        this.lastTouches = [];
    }

    inherit(TouchMouseInput, Input, {
        /**
         * handle mouse and touch events
         * @param {Hammer} manager
         * @param {String} inputEvent
         * @param {Object} inputData
         */
        handler: function TMEhandler(manager, inputEvent, inputData) {
            var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
                isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

            if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
                return;
            }

            // when we're in a touch event, record touches to  de-dupe synthetic mouse event
            if (isTouch) {
                recordTouches.call(this, inputEvent, inputData);
            } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
                return;
            }

            this.callback(manager, inputEvent, inputData);
        },

        /**
         * remove the event listeners
         */
        destroy: function destroy() {
            this.touch.destroy();
            this.mouse.destroy();
        }
    });

    function recordTouches(eventType, eventData) {
        if (eventType & INPUT_START) {
            this.primaryTouch = eventData.changedPointers[0].identifier;
            setLastTouch.call(this, eventData);
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            setLastTouch.call(this, eventData);
        }
    }

    function setLastTouch(eventData) {
        var touch = eventData.changedPointers[0];

        if (touch.identifier === this.primaryTouch) {
            var lastTouch = {x: touch.clientX, y: touch.clientY};
            this.lastTouches.push(lastTouch);
            var lts = this.lastTouches;
            var removeLastTouch = function() {
                var i = lts.indexOf(lastTouch);
                if (i > -1) {
                    lts.splice(i, 1);
                }
            };
            setTimeout(removeLastTouch, DEDUP_TIMEOUT);
        }
    }

    function isSyntheticEvent(eventData) {
        var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
        for (var i = 0; i < this.lastTouches.length; i++) {
            var t = this.lastTouches[i];
            var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
            if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
                return true;
            }
        }
        return false;
    }

    var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined$1;

    // magical touchAction value
    var TOUCH_ACTION_COMPUTE = 'compute';
    var TOUCH_ACTION_AUTO = 'auto';
    var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
    var TOUCH_ACTION_NONE = 'none';
    var TOUCH_ACTION_PAN_X = 'pan-x';
    var TOUCH_ACTION_PAN_Y = 'pan-y';
    var TOUCH_ACTION_MAP = getTouchActionProps();

    /**
     * Touch Action
     * sets the touchAction property or uses the js alternative
     * @param {Manager} manager
     * @param {String} value
     * @constructor
     */
    function TouchAction(manager, value) {
        this.manager = manager;
        this.set(value);
    }

    TouchAction.prototype = {
        /**
         * set the touchAction value on the element or enable the polyfill
         * @param {String} value
         */
        set: function(value) {
            // find out the touch-action by the event handlers
            if (value == TOUCH_ACTION_COMPUTE) {
                value = this.compute();
            }

            if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
                this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
            }
            this.actions = value.toLowerCase().trim();
        },

        /**
         * just re-set the touchAction value
         */
        update: function() {
            this.set(this.manager.options.touchAction);
        },

        /**
         * compute the value for the touchAction property based on the recognizer's settings
         * @returns {String} value
         */
        compute: function() {
            var actions = [];
            each(this.manager.recognizers, function(recognizer) {
                if (boolOrFn(recognizer.options.enable, [recognizer])) {
                    actions = actions.concat(recognizer.getTouchAction());
                }
            });
            return cleanTouchActions(actions.join(' '));
        },

        /**
         * this method is called on each input cycle and provides the preventing of the browser behavior
         * @param {Object} input
         */
        preventDefaults: function(input) {
            var srcEvent = input.srcEvent;
            var direction = input.offsetDirection;

            // if the touch action did prevented once this session
            if (this.manager.session.prevented) {
                srcEvent.preventDefault();
                return;
            }

            var actions = this.actions;
            var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
            var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
            var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

            if (hasNone) {
                //do not prevent defaults if this is a tap gesture

                var isTapPointer = input.pointers.length === 1;
                var isTapMovement = input.distance < 2;
                var isTapTouchTime = input.deltaTime < 250;

                if (isTapPointer && isTapMovement && isTapTouchTime) {
                    return;
                }
            }

            if (hasPanX && hasPanY) {
                // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
                return;
            }

            if (hasNone ||
                (hasPanY && direction & DIRECTION_HORIZONTAL) ||
                (hasPanX && direction & DIRECTION_VERTICAL)) {
                return this.preventSrc(srcEvent);
            }
        },

        /**
         * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
         * @param {Object} srcEvent
         */
        preventSrc: function(srcEvent) {
            this.manager.session.prevented = true;
            srcEvent.preventDefault();
        }
    };

    /**
     * when the touchActions are collected they are not a valid value, so we need to clean things up. *
     * @param {String} actions
     * @returns {*}
     */
    function cleanTouchActions(actions) {
        // none
        if (inStr(actions, TOUCH_ACTION_NONE)) {
            return TOUCH_ACTION_NONE;
        }

        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

        // if both pan-x and pan-y are set (different recognizers
        // for different directions, e.g. horizontal pan but vertical swipe?)
        // we need none (as otherwise with pan-x pan-y combined none of these
        // recognizers will work, since the browser would handle all panning
        if (hasPanX && hasPanY) {
            return TOUCH_ACTION_NONE;
        }

        // pan-x OR pan-y
        if (hasPanX || hasPanY) {
            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
        }

        // manipulation
        if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
            return TOUCH_ACTION_MANIPULATION;
        }

        return TOUCH_ACTION_AUTO;
    }

    function getTouchActionProps() {
        if (!NATIVE_TOUCH_ACTION) {
            return false;
        }
        var touchMap = {};
        var cssSupports = window.CSS && window.CSS.supports;
        ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

            // If css.supports is not supported but there is native touch-action assume it supports
            // all values. This is the case for IE 10 and 11.
            touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
        });
        return touchMap;
    }

    /**
     * Recognizer flow explained; *
     * All recognizers have the initial state of POSSIBLE when a input session starts.
     * The definition of a input session is from the first input until the last input, with all it's movement in it. *
     * Example session for mouse-input: mousedown -> mousemove -> mouseup
     *
     * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
     * which determines with state it should be.
     *
     * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
     * POSSIBLE to give it another change on the next cycle.
     *
     *               Possible
     *                  |
     *            +-----+---------------+
     *            |                     |
     *      +-----+-----+               |
     *      |           |               |
     *   Failed      Cancelled          |
     *                          +-------+------+
     *                          |              |
     *                      Recognized       Began
     *                                         |
     *                                      Changed
     *                                         |
     *                                  Ended/Recognized
     */
    var STATE_POSSIBLE = 1;
    var STATE_BEGAN = 2;
    var STATE_CHANGED = 4;
    var STATE_ENDED = 8;
    var STATE_RECOGNIZED = STATE_ENDED;
    var STATE_CANCELLED = 16;
    var STATE_FAILED = 32;

    /**
     * Recognizer
     * Every recognizer needs to extend from this class.
     * @constructor
     * @param {Object} options
     */
    function Recognizer(options) {
        this.options = assign({}, this.defaults, options || {});

        this.id = uniqueId();

        this.manager = null;

        // default is enable true
        this.options.enable = ifUndefined(this.options.enable, true);

        this.state = STATE_POSSIBLE;

        this.simultaneous = {};
        this.requireFail = [];
    }

    Recognizer.prototype = {
        /**
         * @virtual
         * @type {Object}
         */
        defaults: {},

        /**
         * set options
         * @param {Object} options
         * @return {Recognizer}
         */
        set: function(options) {
            assign(this.options, options);

            // also update the touchAction, in case something changed about the directions/enabled state
            this.manager && this.manager.touchAction.update();
            return this;
        },

        /**
         * recognize simultaneous with an other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        recognizeWith: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
                return this;
            }

            var simultaneous = this.simultaneous;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            if (!simultaneous[otherRecognizer.id]) {
                simultaneous[otherRecognizer.id] = otherRecognizer;
                otherRecognizer.recognizeWith(this);
            }
            return this;
        },

        /**
         * drop the simultaneous link. it doesnt remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRecognizeWith: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
                return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            delete this.simultaneous[otherRecognizer.id];
            return this;
        },

        /**
         * recognizer can only run when an other is failing
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        requireFailure: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
                return this;
            }

            var requireFail = this.requireFail;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            if (inArray(requireFail, otherRecognizer) === -1) {
                requireFail.push(otherRecognizer);
                otherRecognizer.requireFailure(this);
            }
            return this;
        },

        /**
         * drop the requireFailure link. it does not remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRequireFailure: function(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
                return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            var index = inArray(this.requireFail, otherRecognizer);
            if (index > -1) {
                this.requireFail.splice(index, 1);
            }
            return this;
        },

        /**
         * has require failures boolean
         * @returns {boolean}
         */
        hasRequireFailures: function() {
            return this.requireFail.length > 0;
        },

        /**
         * if the recognizer can recognize simultaneous with an other recognizer
         * @param {Recognizer} otherRecognizer
         * @returns {Boolean}
         */
        canRecognizeWith: function(otherRecognizer) {
            return !!this.simultaneous[otherRecognizer.id];
        },

        /**
         * You should use `tryEmit` instead of `emit` directly to check
         * that all the needed recognizers has failed before emitting.
         * @param {Object} input
         */
        emit: function(input) {
            var self = this;
            var state = this.state;

            function emit(event) {
                self.manager.emit(event, input);
            }

            // 'panstart' and 'panmove'
            if (state < STATE_ENDED) {
                emit(self.options.event + stateStr(state));
            }

            emit(self.options.event); // simple 'eventName' events

            if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
                emit(input.additionalEvent);
            }

            // panend and pancancel
            if (state >= STATE_ENDED) {
                emit(self.options.event + stateStr(state));
            }
        },

        /**
         * Check that all the require failure recognizers has failed,
         * if true, it emits a gesture event,
         * otherwise, setup the state to FAILED.
         * @param {Object} input
         */
        tryEmit: function(input) {
            if (this.canEmit()) {
                return this.emit(input);
            }
            // it's failing anyway
            this.state = STATE_FAILED;
        },

        /**
         * can we emit?
         * @returns {boolean}
         */
        canEmit: function() {
            var i = 0;
            while (i < this.requireFail.length) {
                if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                    return false;
                }
                i++;
            }
            return true;
        },

        /**
         * update the recognizer
         * @param {Object} inputData
         */
        recognize: function(inputData) {
            // make a new copy of the inputData
            // so we can change the inputData without messing up the other recognizers
            var inputDataClone = assign({}, inputData);

            // is is enabled and allow recognizing?
            if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
                this.reset();
                this.state = STATE_FAILED;
                return;
            }

            // reset when we've reached the end
            if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
                this.state = STATE_POSSIBLE;
            }

            this.state = this.process(inputDataClone);

            // the recognizer has recognized a gesture
            // so trigger an event
            if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
                this.tryEmit(inputDataClone);
            }
        },

        /**
         * return the state of the recognizer
         * the actual recognizing happens in this method
         * @virtual
         * @param {Object} inputData
         * @returns {Const} STATE
         */
        process: function(inputData) { }, // jshint ignore:line

        /**
         * return the preferred touch-action
         * @virtual
         * @returns {Array}
         */
        getTouchAction: function() { },

        /**
         * called when the gesture isn't allowed to recognize
         * like when another is being recognized or it is disabled
         * @virtual
         */
        reset: function() { }
    };

    /**
     * get a usable string, used as event postfix
     * @param {Const} state
     * @returns {String} state
     */
    function stateStr(state) {
        if (state & STATE_CANCELLED) {
            return 'cancel';
        } else if (state & STATE_ENDED) {
            return 'end';
        } else if (state & STATE_CHANGED) {
            return 'move';
        } else if (state & STATE_BEGAN) {
            return 'start';
        }
        return '';
    }

    /**
     * direction cons to string
     * @param {Const} direction
     * @returns {String}
     */
    function directionStr(direction) {
        if (direction == DIRECTION_DOWN) {
            return 'down';
        } else if (direction == DIRECTION_UP) {
            return 'up';
        } else if (direction == DIRECTION_LEFT) {
            return 'left';
        } else if (direction == DIRECTION_RIGHT) {
            return 'right';
        }
        return '';
    }

    /**
     * get a recognizer by name if it is bound to a manager
     * @param {Recognizer|String} otherRecognizer
     * @param {Recognizer} recognizer
     * @returns {Recognizer}
     */
    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
        var manager = recognizer.manager;
        if (manager) {
            return manager.get(otherRecognizer);
        }
        return otherRecognizer;
    }

    /**
     * This recognizer is just used as a base for the simple attribute recognizers.
     * @constructor
     * @extends Recognizer
     */
    function AttrRecognizer() {
        Recognizer.apply(this, arguments);
    }

    inherit(AttrRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof AttrRecognizer
         */
        defaults: {
            /**
             * @type {Number}
             * @default 1
             */
            pointers: 1
        },

        /**
         * Used to check if it the recognizer receives valid input, like input.distance > 10.
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {Boolean} recognized
         */
        attrTest: function(input) {
            var optionPointers = this.options.pointers;
            return optionPointers === 0 || input.pointers.length === optionPointers;
        },

        /**
         * Process the input and return the state for the recognizer
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {*} State
         */
        process: function(input) {
            var state = this.state;
            var eventType = input.eventType;

            var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
            var isValid = this.attrTest(input);

            // on cancel input and we've recognized before, return STATE_CANCELLED
            if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
                return state | STATE_CANCELLED;
            } else if (isRecognized || isValid) {
                if (eventType & INPUT_END) {
                    return state | STATE_ENDED;
                } else if (!(state & STATE_BEGAN)) {
                    return STATE_BEGAN;
                }
                return state | STATE_CHANGED;
            }
            return STATE_FAILED;
        }
    });

    /**
     * Pan
     * Recognized when the pointer is down and moved in the allowed direction.
     * @constructor
     * @extends AttrRecognizer
     */
    function PanRecognizer() {
        AttrRecognizer.apply(this, arguments);

        this.pX = null;
        this.pY = null;
    }

    inherit(PanRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PanRecognizer
         */
        defaults: {
            event: 'pan',
            threshold: 10,
            pointers: 1,
            direction: DIRECTION_ALL
        },

        getTouchAction: function() {
            var direction = this.options.direction;
            var actions = [];
            if (direction & DIRECTION_HORIZONTAL) {
                actions.push(TOUCH_ACTION_PAN_Y);
            }
            if (direction & DIRECTION_VERTICAL) {
                actions.push(TOUCH_ACTION_PAN_X);
            }
            return actions;
        },

        directionTest: function(input) {
            var options = this.options;
            var hasMoved = true;
            var distance = input.distance;
            var direction = input.direction;
            var x = input.deltaX;
            var y = input.deltaY;

            // lock to axis?
            if (!(direction & options.direction)) {
                if (options.direction & DIRECTION_HORIZONTAL) {
                    direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                    hasMoved = x != this.pX;
                    distance = Math.abs(input.deltaX);
                } else {
                    direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                    hasMoved = y != this.pY;
                    distance = Math.abs(input.deltaY);
                }
            }
            input.direction = direction;
            return hasMoved && distance > options.threshold && direction & options.direction;
        },

        attrTest: function(input) {
            return AttrRecognizer.prototype.attrTest.call(this, input) &&
                (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
        },

        emit: function(input) {

            this.pX = input.deltaX;
            this.pY = input.deltaY;

            var direction = directionStr(input.direction);

            if (direction) {
                input.additionalEvent = this.options.event + direction;
            }
            this._super.emit.call(this, input);
        }
    });

    /**
     * Pinch
     * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
     * @constructor
     * @extends AttrRecognizer
     */
    function PinchRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(PinchRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
            event: 'pinch',
            threshold: 0,
            pointers: 2
        },

        getTouchAction: function() {
            return [TOUCH_ACTION_NONE];
        },

        attrTest: function(input) {
            return this._super.attrTest.call(this, input) &&
                (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
        },

        emit: function(input) {
            if (input.scale !== 1) {
                var inOut = input.scale < 1 ? 'in' : 'out';
                input.additionalEvent = this.options.event + inOut;
            }
            this._super.emit.call(this, input);
        }
    });

    /**
     * Press
     * Recognized when the pointer is down for x ms without any movement.
     * @constructor
     * @extends Recognizer
     */
    function PressRecognizer() {
        Recognizer.apply(this, arguments);

        this._timer = null;
        this._input = null;
    }

    inherit(PressRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PressRecognizer
         */
        defaults: {
            event: 'press',
            pointers: 1,
            time: 251, // minimal time of the pointer to be pressed
            threshold: 9 // a minimal movement is ok, but keep it low
        },

        getTouchAction: function() {
            return [TOUCH_ACTION_AUTO];
        },

        process: function(input) {
            var options = this.options;
            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTime = input.deltaTime > options.time;

            this._input = input;

            // we only allow little movement
            // and we've reached an end event, so a tap is possible
            if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
                this.reset();
            } else if (input.eventType & INPUT_START) {
                this.reset();
                this._timer = setTimeoutContext(function() {
                    this.state = STATE_RECOGNIZED;
                    this.tryEmit();
                }, options.time, this);
            } else if (input.eventType & INPUT_END) {
                return STATE_RECOGNIZED;
            }
            return STATE_FAILED;
        },

        reset: function() {
            clearTimeout(this._timer);
        },

        emit: function(input) {
            if (this.state !== STATE_RECOGNIZED) {
                return;
            }

            if (input && (input.eventType & INPUT_END)) {
                this.manager.emit(this.options.event + 'up', input);
            } else {
                this._input.timeStamp = now();
                this.manager.emit(this.options.event, this._input);
            }
        }
    });

    /**
     * Rotate
     * Recognized when two or more pointer are moving in a circular motion.
     * @constructor
     * @extends AttrRecognizer
     */
    function RotateRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(RotateRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof RotateRecognizer
         */
        defaults: {
            event: 'rotate',
            threshold: 0,
            pointers: 2
        },

        getTouchAction: function() {
            return [TOUCH_ACTION_NONE];
        },

        attrTest: function(input) {
            return this._super.attrTest.call(this, input) &&
                (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
        }
    });

    /**
     * Swipe
     * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
     * @constructor
     * @extends AttrRecognizer
     */
    function SwipeRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(SwipeRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof SwipeRecognizer
         */
        defaults: {
            event: 'swipe',
            threshold: 10,
            velocity: 0.3,
            direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
            pointers: 1
        },

        getTouchAction: function() {
            return PanRecognizer.prototype.getTouchAction.call(this);
        },

        attrTest: function(input) {
            var direction = this.options.direction;
            var velocity;

            if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
                velocity = input.overallVelocity;
            } else if (direction & DIRECTION_HORIZONTAL) {
                velocity = input.overallVelocityX;
            } else if (direction & DIRECTION_VERTICAL) {
                velocity = input.overallVelocityY;
            }

            return this._super.attrTest.call(this, input) &&
                direction & input.offsetDirection &&
                input.distance > this.options.threshold &&
                input.maxPointers == this.options.pointers &&
                abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
        },

        emit: function(input) {
            var direction = directionStr(input.offsetDirection);
            if (direction) {
                this.manager.emit(this.options.event + direction, input);
            }

            this.manager.emit(this.options.event, input);
        }
    });

    /**
     * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
     * between the given interval and position. The delay option can be used to recognize multi-taps without firing
     * a single tap.
     *
     * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
     * multi-taps being recognized.
     * @constructor
     * @extends Recognizer
     */
    function TapRecognizer() {
        Recognizer.apply(this, arguments);

        // previous time and center,
        // used for tap counting
        this.pTime = false;
        this.pCenter = false;

        this._timer = null;
        this._input = null;
        this.count = 0;
    }

    inherit(TapRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
            event: 'tap',
            pointers: 1,
            taps: 1,
            interval: 300, // max time between the multi-tap taps
            time: 250, // max time of the pointer to be down (like finger on the screen)
            threshold: 9, // a minimal movement is ok, but keep it low
            posThreshold: 10 // a multi-tap can be a bit off the initial position
        },

        getTouchAction: function() {
            return [TOUCH_ACTION_MANIPULATION];
        },

        process: function(input) {
            var options = this.options;

            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTouchTime = input.deltaTime < options.time;

            this.reset();

            if ((input.eventType & INPUT_START) && (this.count === 0)) {
                return this.failTimeout();
            }

            // we only allow little movement
            // and we've reached an end event, so a tap is possible
            if (validMovement && validTouchTime && validPointers) {
                if (input.eventType != INPUT_END) {
                    return this.failTimeout();
                }

                var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
                var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

                this.pTime = input.timeStamp;
                this.pCenter = input.center;

                if (!validMultiTap || !validInterval) {
                    this.count = 1;
                } else {
                    this.count += 1;
                }

                this._input = input;

                // if tap count matches we have recognized it,
                // else it has began recognizing...
                var tapCount = this.count % options.taps;
                if (tapCount === 0) {
                    // no failing requirements, immediately trigger the tap event
                    // or wait as long as the multitap interval to trigger
                    if (!this.hasRequireFailures()) {
                        return STATE_RECOGNIZED;
                    } else {
                        this._timer = setTimeoutContext(function() {
                            this.state = STATE_RECOGNIZED;
                            this.tryEmit();
                        }, options.interval, this);
                        return STATE_BEGAN;
                    }
                }
            }
            return STATE_FAILED;
        },

        failTimeout: function() {
            this._timer = setTimeoutContext(function() {
                this.state = STATE_FAILED;
            }, this.options.interval, this);
            return STATE_FAILED;
        },

        reset: function() {
            clearTimeout(this._timer);
        },

        emit: function() {
            if (this.state == STATE_RECOGNIZED) {
                this._input.tapCount = this.count;
                this.manager.emit(this.options.event, this._input);
            }
        }
    });

    /**
     * Simple way to create a manager with a default set of recognizers.
     * @param {HTMLElement} element
     * @param {Object} [options]
     * @constructor
     */
    function Hammer(element, options) {
        options = options || {};
        options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
        return new Manager(element, options);
    }

    /**
     * @const {string}
     */
    Hammer.VERSION = '2.0.7';

    /**
     * default settings
     * @namespace
     */
    Hammer.defaults = {
        /**
         * set if DOM events are being triggered.
         * But this is slower and unused by simple implementations, so disabled by default.
         * @type {Boolean}
         * @default false
         */
        domEvents: false,

        /**
         * The value for the touchAction property/fallback.
         * When set to `compute` it will magically set the correct value based on the added recognizers.
         * @type {String}
         * @default compute
         */
        touchAction: TOUCH_ACTION_COMPUTE,

        /**
         * @type {Boolean}
         * @default true
         */
        enable: true,

        /**
         * EXPERIMENTAL FEATURE -- can be removed/changed
         * Change the parent input target element.
         * If Null, then it is being set the to main element.
         * @type {Null|EventTarget}
         * @default null
         */
        inputTarget: null,

        /**
         * force an input class
         * @type {Null|Function}
         * @default null
         */
        inputClass: null,

        /**
         * Default recognizer setup when calling `Hammer()`
         * When creating a new Manager these will be skipped.
         * @type {Array}
         */
        preset: [
            // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
            [RotateRecognizer, {enable: false}],
            [PinchRecognizer, {enable: false}, ['rotate']],
            [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
            [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
            [TapRecognizer],
            [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
            [PressRecognizer]
        ],

        /**
         * Some CSS properties can be used to improve the working of Hammer.
         * Add them to this method and they will be set when creating a new Manager.
         * @namespace
         */
        cssProps: {
            /**
             * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userSelect: 'none',

            /**
             * Disable the Windows Phone grippers when pressing an element.
             * @type {String}
             * @default 'none'
             */
            touchSelect: 'none',

            /**
             * Disables the default callout shown when you touch and hold a touch target.
             * On iOS, when you touch and hold a touch target such as a link, Safari displays
             * a callout containing information about the link. This property allows you to disable that callout.
             * @type {String}
             * @default 'none'
             */
            touchCallout: 'none',

            /**
             * Specifies whether zooming is enabled. Used by IE10>
             * @type {String}
             * @default 'none'
             */
            contentZooming: 'none',

            /**
             * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userDrag: 'none',

            /**
             * Overrides the highlight color shown when the user taps a link or a JavaScript
             * clickable element in iOS. This property obeys the alpha value, if specified.
             * @type {String}
             * @default 'rgba(0,0,0,0)'
             */
            tapHighlightColor: 'rgba(0,0,0,0)'
        }
    };

    var STOP = 1;
    var FORCED_STOP = 2;

    /**
     * Manager
     * @param {HTMLElement} element
     * @param {Object} [options]
     * @constructor
     */
    function Manager(element, options) {
        this.options = assign({}, Hammer.defaults, options || {});

        this.options.inputTarget = this.options.inputTarget || element;

        this.handlers = {};
        this.session = {};
        this.recognizers = [];
        this.oldCssProps = {};

        this.element = element;
        this.input = createInputInstance(this);
        this.touchAction = new TouchAction(this, this.options.touchAction);

        toggleCssProps(this, true);

        each(this.options.recognizers, function(item) {
            var recognizer = this.add(new (item[0])(item[1]));
            item[2] && recognizer.recognizeWith(item[2]);
            item[3] && recognizer.requireFailure(item[3]);
        }, this);
    }

    Manager.prototype = {
        /**
         * set options
         * @param {Object} options
         * @returns {Manager}
         */
        set: function(options) {
            assign(this.options, options);

            // Options that need a little more setup
            if (options.touchAction) {
                this.touchAction.update();
            }
            if (options.inputTarget) {
                // Clean up existing event listeners and reinitialize
                this.input.destroy();
                this.input.target = options.inputTarget;
                this.input.init();
            }
            return this;
        },

        /**
         * stop recognizing for this session.
         * This session will be discarded, when a new [input]start event is fired.
         * When forced, the recognizer cycle is stopped immediately.
         * @param {Boolean} [force]
         */
        stop: function(force) {
            this.session.stopped = force ? FORCED_STOP : STOP;
        },

        /**
         * run the recognizers!
         * called by the inputHandler function on every movement of the pointers (touches)
         * it walks through all the recognizers and tries to detect the gesture that is being made
         * @param {Object} inputData
         */
        recognize: function(inputData) {
            var session = this.session;
            if (session.stopped) {
                return;
            }

            // run the touch-action polyfill
            this.touchAction.preventDefaults(inputData);

            var recognizer;
            var recognizers = this.recognizers;

            // this holds the recognizer that is being recognized.
            // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
            // if no recognizer is detecting a thing, it is set to `null`
            var curRecognizer = session.curRecognizer;

            // reset when the last recognizer is recognized
            // or when we're in a new session
            if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
                curRecognizer = session.curRecognizer = null;
            }

            var i = 0;
            while (i < recognizers.length) {
                recognizer = recognizers[i];

                // find out if we are allowed try to recognize the input for this one.
                // 1.   allow if the session is NOT forced stopped (see the .stop() method)
                // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
                //      that is being recognized.
                // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
                //      this can be setup with the `recognizeWith()` method on the recognizer.
                if (session.stopped !== FORCED_STOP && ( // 1
                        !curRecognizer || recognizer == curRecognizer || // 2
                        recognizer.canRecognizeWith(curRecognizer))) { // 3
                    recognizer.recognize(inputData);
                } else {
                    recognizer.reset();
                }

                // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
                // current active recognizer. but only if we don't already have an active recognizer
                if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                    curRecognizer = session.curRecognizer = recognizer;
                }
                i++;
            }
        },

        /**
         * get a recognizer by its event name.
         * @param {Recognizer|String} recognizer
         * @returns {Recognizer|Null}
         */
        get: function(recognizer) {
            if (recognizer instanceof Recognizer) {
                return recognizer;
            }

            var recognizers = this.recognizers;
            for (var i = 0; i < recognizers.length; i++) {
                if (recognizers[i].options.event == recognizer) {
                    return recognizers[i];
                }
            }
            return null;
        },

        /**
         * add a recognizer to the manager
         * existing recognizers with the same event name will be removed
         * @param {Recognizer} recognizer
         * @returns {Recognizer|Manager}
         */
        add: function(recognizer) {
            if (invokeArrayArg(recognizer, 'add', this)) {
                return this;
            }

            // remove existing
            var existing = this.get(recognizer.options.event);
            if (existing) {
                this.remove(existing);
            }

            this.recognizers.push(recognizer);
            recognizer.manager = this;

            this.touchAction.update();
            return recognizer;
        },

        /**
         * remove a recognizer by name or instance
         * @param {Recognizer|String} recognizer
         * @returns {Manager}
         */
        remove: function(recognizer) {
            if (invokeArrayArg(recognizer, 'remove', this)) {
                return this;
            }

            recognizer = this.get(recognizer);

            // let's make sure this recognizer exists
            if (recognizer) {
                var recognizers = this.recognizers;
                var index = inArray(recognizers, recognizer);

                if (index !== -1) {
                    recognizers.splice(index, 1);
                    this.touchAction.update();
                }
            }

            return this;
        },

        /**
         * bind event
         * @param {String} events
         * @param {Function} handler
         * @returns {EventEmitter} this
         */
        on: function(events, handler) {
            if (events === undefined$1) {
                return;
            }
            if (handler === undefined$1) {
                return;
            }

            var handlers = this.handlers;
            each(splitStr(events), function(event) {
                handlers[event] = handlers[event] || [];
                handlers[event].push(handler);
            });
            return this;
        },

        /**
         * unbind event, leave emit blank to remove all handlers
         * @param {String} events
         * @param {Function} [handler]
         * @returns {EventEmitter} this
         */
        off: function(events, handler) {
            if (events === undefined$1) {
                return;
            }

            var handlers = this.handlers;
            each(splitStr(events), function(event) {
                if (!handler) {
                    delete handlers[event];
                } else {
                    handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
                }
            });
            return this;
        },

        /**
         * emit event to the listeners
         * @param {String} event
         * @param {Object} data
         */
        emit: function(event, data) {
            // we also want to trigger dom events
            if (this.options.domEvents) {
                triggerDomEvent(event, data);
            }

            // no handlers, so skip it all
            var handlers = this.handlers[event] && this.handlers[event].slice();
            if (!handlers || !handlers.length) {
                return;
            }

            data.type = event;
            data.preventDefault = function() {
                data.srcEvent.preventDefault();
            };

            var i = 0;
            while (i < handlers.length) {
                handlers[i](data);
                i++;
            }
        },

        /**
         * destroy the manager and unbinds all events
         * it doesn't unbind dom events, that is the user own responsibility
         */
        destroy: function() {
            this.element && toggleCssProps(this, false);

            this.handlers = {};
            this.session = {};
            this.input.destroy();
            this.element = null;
        }
    };

    /**
     * add/remove the css properties as defined in manager.options.cssProps
     * @param {Manager} manager
     * @param {Boolean} add
     */
    function toggleCssProps(manager, add) {
        var element = manager.element;
        if (!element.style) {
            return;
        }
        var prop;
        each(manager.options.cssProps, function(value, name) {
            prop = prefixed(element.style, name);
            if (add) {
                manager.oldCssProps[prop] = element.style[prop];
                element.style[prop] = value;
            } else {
                element.style[prop] = manager.oldCssProps[prop] || '';
            }
        });
        if (!add) {
            manager.oldCssProps = {};
        }
    }

    /**
     * trigger dom event
     * @param {String} event
     * @param {Object} data
     */
    function triggerDomEvent(event, data) {
        var gestureEvent = document.createEvent('Event');
        gestureEvent.initEvent(event, true, true);
        gestureEvent.gesture = data;
        data.target.dispatchEvent(gestureEvent);
    }

    assign(Hammer, {
        INPUT_START: INPUT_START,
        INPUT_MOVE: INPUT_MOVE,
        INPUT_END: INPUT_END,
        INPUT_CANCEL: INPUT_CANCEL,

        STATE_POSSIBLE: STATE_POSSIBLE,
        STATE_BEGAN: STATE_BEGAN,
        STATE_CHANGED: STATE_CHANGED,
        STATE_ENDED: STATE_ENDED,
        STATE_RECOGNIZED: STATE_RECOGNIZED,
        STATE_CANCELLED: STATE_CANCELLED,
        STATE_FAILED: STATE_FAILED,

        DIRECTION_NONE: DIRECTION_NONE,
        DIRECTION_LEFT: DIRECTION_LEFT,
        DIRECTION_RIGHT: DIRECTION_RIGHT,
        DIRECTION_UP: DIRECTION_UP,
        DIRECTION_DOWN: DIRECTION_DOWN,
        DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
        DIRECTION_VERTICAL: DIRECTION_VERTICAL,
        DIRECTION_ALL: DIRECTION_ALL,

        Manager: Manager,
        Input: Input,
        TouchAction: TouchAction,

        TouchInput: TouchInput,
        MouseInput: MouseInput,
        PointerEventInput: PointerEventInput,
        TouchMouseInput: TouchMouseInput,
        SingleTouchInput: SingleTouchInput,

        Recognizer: Recognizer,
        AttrRecognizer: AttrRecognizer,
        Tap: TapRecognizer,
        Pan: PanRecognizer,
        Swipe: SwipeRecognizer,
        Pinch: PinchRecognizer,
        Rotate: RotateRecognizer,
        Press: PressRecognizer,

        on: addEventListeners,
        off: removeEventListeners,
        each: each,
        merge: merge,
        extend: extend,
        assign: assign,
        inherit: inherit,
        bindFn: bindFn,
        prefixed: prefixed
    });

    // this prevents errors when Hammer is loaded in the presence of an AMD
    //  style loader but by script tag, not by the loader.
    var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
    freeGlobal.Hammer = Hammer;

    if (typeof undefined$1 === 'function' && undefined$1.amd) {
        undefined$1(function() {
            return Hammer;
        });
    } else if (module.exports) {
        module.exports = Hammer;
    } else {
        window[exportName] = Hammer;
    }

    })(window, document, 'Hammer');
    });

    var Hammer = /*#__PURE__*/_mergeNamespaces({
        __proto__: null,
        'default': hammer
    }, [hammer]);

    /* src\Snippets\TextShower.svelte generated by Svelte v3.49.0 */
    const file_1$1 = "src\\Snippets\\TextShower.svelte";

    function create_fragment$y(ctx) {
    	let div;
    	let pre;
    	let t;
    	let div_title_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			pre = element("pre");
    			t = text(/*contents*/ ctx[1]);
    			add_location(pre, file_1$1, 26, 4, 956);
    			attr_dev(div, "title", div_title_value = /*file*/ ctx[0].name);
    			add_location(div, file_1$1, 25, 0, 928);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, pre);
    			append_dev(pre, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*contents*/ 2) set_data_dev(t, /*contents*/ ctx[1]);

    			if (dirty & /*file*/ 1 && div_title_value !== (div_title_value = /*file*/ ctx[0].name)) {
    				attr_dev(div, "title", div_title_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let contents;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextShower', slots, []);
    	let { url } = $$props;
    	let { file } = $$props;

    	onMount(async () => {
    		$$invalidate(1, contents = await (await fetch(url)).text());
    	});

    	const writable_props = ['url', 'file'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TextShower> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    	};

    	$$self.$capture_state = () => ({ onMount, url, file, contents });

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate(2, url = $$props.url);
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('contents' in $$props) $$invalidate(1, contents = $$props.contents);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, contents = "");
    	return [file, contents, url];
    }

    class TextShower extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, { url: 2, file: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextShower",
    			options,
    			id: create_fragment$y.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*url*/ ctx[2] === undefined && !('url' in props)) {
    			console.warn("<TextShower> was created without expected prop 'url'");
    		}

    		if (/*file*/ ctx[0] === undefined && !('file' in props)) {
    			console.warn("<TextShower> was created without expected prop 'file'");
    		}
    	}

    	get url() {
    		throw new Error("<TextShower>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<TextShower>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get file() {
    		throw new Error("<TextShower>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<TextShower>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconDownload.svelte generated by Svelte v3.49.0 */

    const file$v = "src\\SVG\\IconDownload.svelte";

    function create_fragment$x(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z");
    			add_location(path, file$v, 12, 4, 340);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$v, 5, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconDownload', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconDownload> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconDownload extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconDownload",
    			options,
    			id: create_fragment$x.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconDownload> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconDownload>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconDownload>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconDownload>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconDownload>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Preview\Slideshow.svelte generated by Svelte v3.49.0 */
    const file$u = "src\\Preview\\Slideshow.svelte";

    // (196:8) {:else}
    function create_else_block$6(ctx) {
    	let img;
    	let img_alt_value;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "centered-slide svelte-1dkimwh");
    			attr_dev(img, "alt", img_alt_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].icon[0]);
    			attr_dev(img, "draggable", "false");
    			attr_dev(img, "ondragstart", "return false;");
    			if (!src_url_equal(img.src, img_src_value = "icons/48x48/" + /*files*/ ctx[1][/*fileIdx*/ ctx[0]].icon[0] + ".svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$u, 196, 12, 6011);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files, fileIdx*/ 3 && img_alt_value !== (img_alt_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].icon[0])) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*files, fileIdx*/ 3 && !src_url_equal(img.src, img_src_value = "icons/48x48/" + /*files*/ ctx[1][/*fileIdx*/ ctx[0]].icon[0] + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(196:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (169:8) {#if isMimeTypeSupported(files[fileIdx].mimeType)}
    function create_if_block$8(ctx) {
    	let show_if;
    	let show_if_1;
    	let show_if_2;
    	let show_if_3;
    	let show_if_4;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block_1$6,
    		create_if_block_2$3,
    		create_if_block_3$2,
    		create_if_block_4$1,
    		create_if_block_5$1
    	];

    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (dirty & /*files, fileIdx*/ 3) show_if = null;
    		if (dirty & /*files, fileIdx*/ 3) show_if_1 = null;
    		if (dirty & /*files, fileIdx*/ 3) show_if_2 = null;
    		if (dirty & /*files, fileIdx*/ 3) show_if_3 = null;
    		if (dirty & /*files, fileIdx*/ 3) show_if_4 = null;
    		if (show_if == null) show_if = !!isMimeTypeText(/*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType);
    		if (show_if) return 0;
    		if (show_if_1 == null) show_if_1 = !!isMimeTypeImage(/*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType);
    		if (show_if_1) return 1;
    		if (show_if_2 == null) show_if_2 = !!isMimeTypeVideo(/*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType);
    		if (show_if_2) return 2;
    		if (show_if_3 == null) show_if_3 = !!isMimeTypeAudio(/*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType);
    		if (show_if_3) return 3;
    		if (show_if_4 == null) show_if_4 = !!isMimeTypePDF(/*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType);
    		if (show_if_4) return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx, -1))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(169:8) {#if isMimeTypeSupported(files[fileIdx].mimeType)}",
    		ctx
    	});

    	return block;
    }

    // (192:61) 
    function create_if_block_5$1(ctx) {
    	let embed;
    	let embed_type_value;
    	let embed_src_value;

    	const block = {
    		c: function create() {
    			embed = element("embed");
    			attr_dev(embed, "class", "centered-slide centered-maxscreen w100 h100 svelte-1dkimwh");
    			attr_dev(embed, "type", embed_type_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType);
    			if (!src_url_equal(embed.src, embed_src_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false))) attr_dev(embed, "src", embed_src_value);
    			add_location(embed, file$u, 192, 16, 5816);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, embed, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files, fileIdx*/ 3 && embed_type_value !== (embed_type_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType)) {
    				attr_dev(embed, "type", embed_type_value);
    			}

    			if (dirty & /*files, fileIdx*/ 3 && !src_url_equal(embed.src, embed_src_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false))) {
    				attr_dev(embed, "src", embed_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(embed);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(192:61) ",
    		ctx
    	});

    	return block;
    }

    // (185:63) 
    function create_if_block_4$1(ctx) {
    	let div;
    	let audio;
    	let source;
    	let source_src_value;
    	let source_type_value;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			audio = element("audio");
    			source = element("source");
    			t = text("\n                        Your browser does not support the audio tag.");
    			if (!src_url_equal(source.src, source_src_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false))) attr_dev(source, "src", source_src_value);
    			attr_dev(source, "type", source_type_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType);
    			attr_dev(source, "class", "svelte-1dkimwh");
    			add_location(source, file$u, 187, 24, 5542);
    			audio.controls = true;
    			attr_dev(audio, "class", "svelte-1dkimwh");
    			add_location(audio, file$u, 186, 20, 5501);
    			attr_dev(div, "class", "centered-slide svelte-1dkimwh");
    			add_location(div, file$u, 185, 16, 5452);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, audio);
    			append_dev(audio, source);
    			append_dev(audio, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files, fileIdx*/ 3 && !src_url_equal(source.src, source_src_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false))) {
    				attr_dev(source, "src", source_src_value);
    			}

    			if (dirty & /*files, fileIdx*/ 3 && source_type_value !== (source_type_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType)) {
    				attr_dev(source, "type", source_type_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(185:63) ",
    		ctx
    	});

    	return block;
    }

    // (178:63) 
    function create_if_block_3$2(ctx) {
    	let div;
    	let video;
    	let source;
    	let source_src_value;
    	let source_type_value;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			video = element("video");
    			source = element("source");
    			t = text("\n                        Your browser does not support the video tag.");
    			if (!src_url_equal(source.src, source_src_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false))) attr_dev(source, "src", source_src_value);
    			attr_dev(source, "type", source_type_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType);
    			attr_dev(source, "class", "svelte-1dkimwh");
    			add_location(source, file$u, 180, 24, 5176);
    			video.controls = true;
    			attr_dev(video, "class", "svelte-1dkimwh");
    			add_location(video, file$u, 179, 20, 5135);
    			attr_dev(div, "class", "centered-slide svelte-1dkimwh");
    			add_location(div, file$u, 178, 16, 5086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, video);
    			append_dev(video, source);
    			append_dev(video, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files, fileIdx*/ 3 && !src_url_equal(source.src, source_src_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false))) {
    				attr_dev(source, "src", source_src_value);
    			}

    			if (dirty & /*files, fileIdx*/ 3 && source_type_value !== (source_type_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType)) {
    				attr_dev(source, "type", source_type_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(178:63) ",
    		ctx
    	});

    	return block;
    }

    // (174:63) 
    function create_if_block_2$3(ctx) {
    	let img;
    	let img_alt_value;
    	let img_title_value;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "alt", img_alt_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name);
    			attr_dev(img, "title", img_title_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name);
    			attr_dev(img, "draggable", "false");
    			attr_dev(img, "ondragstart", "return false;");
    			attr_dev(img, "class", "centered-slide centered-maxscreen cursor-zoom-in svelte-1dkimwh");
    			if (!src_url_equal(img.src, img_src_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false))) attr_dev(img, "src", img_src_value);
    			add_location(img, file$u, 174, 16, 4746);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*stepMode*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files, fileIdx*/ 3 && img_alt_value !== (img_alt_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*files, fileIdx*/ 3 && img_title_value !== (img_title_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name)) {
    				attr_dev(img, "title", img_title_value);
    			}

    			if (dirty & /*files, fileIdx*/ 3 && !src_url_equal(img.src, img_src_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false))) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(174:63) ",
    		ctx
    	});

    	return block;
    }

    // (170:12) {#if isMimeTypeText(files[fileIdx].mimeType)}
    function create_if_block_1$6(ctx) {
    	let div;
    	let textshower;
    	let current;

    	textshower = new TextShower({
    			props: {
    				url: /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false),
    				file: /*files*/ ctx[1][/*fileIdx*/ ctx[0]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(textshower.$$.fragment);
    			attr_dev(div, "class", "centered-slide centered-maxscreen text-pane svelte-1dkimwh");
    			add_location(div, file$u, 170, 16, 4495);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(textshower, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textshower_changes = {};
    			if (dirty & /*files, fileIdx*/ 3) textshower_changes.url = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false);
    			if (dirty & /*files, fileIdx*/ 3) textshower_changes.file = /*files*/ ctx[1][/*fileIdx*/ ctx[0]];
    			textshower.$set(textshower_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textshower.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textshower.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(textshower);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(170:12) {#if isMimeTypeText(files[fileIdx].mimeType)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let div7;
    	let div0;
    	let t0;
    	let div3;
    	let div1;
    	let t1_value = /*fileIdx*/ ctx[0] + 1 + "";
    	let t1;
    	let t2;
    	let t3_value = /*files*/ ctx[1].length + "";
    	let t3;
    	let t4;
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let t5;
    	let div2;
    	let t6_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name + "";
    	let t6;
    	let div2_title_value;
    	let t7;
    	let div4;
    	let a;
    	let icondownload;
    	let a_href_value;
    	let t8;
    	let div5;
    	let t10;
    	let div6;
    	let div7_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$8, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*files, fileIdx*/ 3) show_if = null;
    		if (show_if == null) show_if = !!isMimeTypeSupported(/*files*/ ctx[1][/*fileIdx*/ ctx[0]].mimeType);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	icondownload = new IconDownload({
    			props: { size: 24, color: "white" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = text(" / ");
    			t3 = text(t3_value);
    			t4 = space();
    			if_block.c();
    			t5 = space();
    			div2 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div4 = element("div");
    			a = element("a");
    			create_component(icondownload.$$.fragment);
    			t8 = space();
    			div5 = element("div");
    			div5.textContent = "❮";
    			t10 = space();
    			div6 = element("div");
    			div6.textContent = "❯";
    			attr_dev(div0, "class", "x-top-right cursor-pointer svelte-1dkimwh");
    			add_location(div0, file$u, 165, 4, 4191);
    			attr_dev(div1, "class", "numbertext svelte-1dkimwh");
    			add_location(div1, file$u, 167, 8, 4301);
    			attr_dev(div2, "class", "caption ellipsis svelte-1dkimwh");
    			attr_dev(div2, "title", div2_title_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name);
    			add_location(div2, file$u, 199, 8, 6202);
    			attr_dev(div3, "class", "slideshow-container svelte-1dkimwh");
    			add_location(div3, file$u, 166, 4, 4259);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", a_href_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(true));
    			attr_dev(a, "class", "svelte-1dkimwh");
    			add_location(a, file$u, 202, 8, 6351);
    			attr_dev(div4, "class", "download svelte-1dkimwh");
    			attr_dev(div4, "title", "Download");
    			add_location(div4, file$u, 201, 4, 6303);
    			attr_dev(div5, "class", "prev svelte-1dkimwh");
    			add_location(div5, file$u, 206, 4, 6485);
    			attr_dev(div6, "class", "next svelte-1dkimwh");
    			add_location(div6, file$u, 207, 4, 6538);
    			attr_dev(div7, "id", "slide-container");
    			attr_dev(div7, "class", "blanket svelte-1dkimwh");
    			add_location(div7, file$u, 164, 0, 4128);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div7, t0);
    			append_dev(div7, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div3, t4);
    			if_blocks[current_block_type_index].m(div3, null);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, t6);
    			append_dev(div7, t7);
    			append_dev(div7, div4);
    			append_dev(div4, a);
    			mount_component(icondownload, a, null);
    			append_dev(div7, t8);
    			append_dev(div7, div5);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*close*/ ctx[2], false, false, false),
    					listen_dev(div5, "click", /*prev*/ ctx[5], false, false, false),
    					listen_dev(div6, "click", /*next*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*fileIdx*/ 1) && t1_value !== (t1_value = /*fileIdx*/ ctx[0] + 1 + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*files*/ 2) && t3_value !== (t3_value = /*files*/ ctx[1].length + "")) set_data_dev(t3, t3_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div3, t5);
    			}

    			if ((!current || dirty & /*files, fileIdx*/ 3) && t6_value !== (t6_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name + "")) set_data_dev(t6, t6_value);

    			if (!current || dirty & /*files, fileIdx*/ 3 && div2_title_value !== (div2_title_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name)) {
    				attr_dev(div2, "title", div2_title_value);
    			}

    			if (!current || dirty & /*files, fileIdx*/ 3 && a_href_value !== (a_href_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(true))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(icondownload.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div7_transition) div7_transition = create_bidirectional_transition(div7, fade, {}, true);
    				div7_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(icondownload.$$.fragment, local);
    			if (!div7_transition) div7_transition = create_bidirectional_transition(div7, fade, {}, false);
    			div7_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if_blocks[current_block_type_index].d();
    			destroy_component(icondownload);
    			if (detaching && div7_transition) div7_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slideshow', slots, []);
    	let { files } = $$props;
    	let { fileIdx } = $$props;
    	const dispatch = createEventDispatcher();
    	let manager;

    	onMount(() => {
    		document.addEventListener('keydown', handleKeyboardEvent);
    		manager = new hammer.Manager(document.getElementById("slide-container"));
    		manager.add(new hammer.Swipe());
    		manager.on('swipeleft', next);
    		manager.on('swiperight', prev);
    	});

    	onDestroy(() => {
    		document.removeEventListener('keydown', handleKeyboardEvent);
    		manager.destroy();
    	});

    	// adapted from https://siongui.github.io/2012/06/25/javascript-keyboard-event-arrow-key-example/
    	function handleKeyboardEvent(evt) {
    		const keycode = evt.keyCode || evt.which;

    		switch (keycode) {
    			case 37:
    				// Left
    				prev();
    				break;
    			case 39:
    				// Right
    				next();
    				break;
    		}
    	}

    	function close(e) {
    		dispatch("closePreview", {});
    	}

    	function stepMode() {
    		dispatch("stepMode", {});
    	}

    	function next() {
    		if ($$invalidate(0, ++fileIdx) == files.length) $$invalidate(0, fileIdx = 0);
    	}

    	function prev() {
    		if ($$invalidate(0, fileIdx--, fileIdx) == 0) $$invalidate(0, fileIdx = files.length - 1);
    	}

    	const writable_props = ['files', 'fileIdx'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Slideshow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('files' in $$props) $$invalidate(1, files = $$props.files);
    		if ('fileIdx' in $$props) $$invalidate(0, fileIdx = $$props.fileIdx);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		fade,
    		Hammer,
    		isMimeTypeText,
    		isMimeTypeImage,
    		isMimeTypeSupported,
    		isMimeTypeVideo,
    		isMimeTypeAudio,
    		isMimeTypePDF,
    		TextShower,
    		IconDownload,
    		files,
    		fileIdx,
    		dispatch,
    		manager,
    		handleKeyboardEvent,
    		close,
    		stepMode,
    		next,
    		prev
    	});

    	$$self.$inject_state = $$props => {
    		if ('files' in $$props) $$invalidate(1, files = $$props.files);
    		if ('fileIdx' in $$props) $$invalidate(0, fileIdx = $$props.fileIdx);
    		if ('manager' in $$props) manager = $$props.manager;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [fileIdx, files, close, stepMode, next, prev];
    }

    class Slideshow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { files: 1, fileIdx: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slideshow",
    			options,
    			id: create_fragment$w.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*files*/ ctx[1] === undefined && !('files' in props)) {
    			console.warn("<Slideshow> was created without expected prop 'files'");
    		}

    		if (/*fileIdx*/ ctx[0] === undefined && !('fileIdx' in props)) {
    			console.warn("<Slideshow> was created without expected prop 'fileIdx'");
    		}
    	}

    	get files() {
    		throw new Error("<Slideshow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<Slideshow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fileIdx() {
    		throw new Error("<Slideshow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileIdx(value) {
    		throw new Error("<Slideshow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Preview\FullScreen.svelte generated by Svelte v3.49.0 */
    const file$t = "src\\Preview\\FullScreen.svelte";

    function create_fragment$v(ctx) {
    	let div;
    	let img;
    	let img_alt_value;
    	let img_title_value;
    	let img_src_value;
    	let div_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "alt", img_alt_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name);
    			attr_dev(img, "title", img_title_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name);
    			attr_dev(img, "draggable", "false");
    			attr_dev(img, "ondragstart", "return false;");
    			attr_dev(img, "class", "centered-slide cursor-zoom-in shadow-5 full-screen svelte-2bjq9d");
    			if (!src_url_equal(img.src, img_src_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false))) attr_dev(img, "src", img_src_value);
    			add_location(img, file$t, 90, 4, 2849);
    			attr_dev(div, "id", "img-container");
    			attr_dev(div, "class", "blanket blanket-clear");
    			add_location(div, file$t, 89, 0, 2774);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*stepMode*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*files, fileIdx*/ 3 && img_alt_value !== (img_alt_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (!current || dirty & /*files, fileIdx*/ 3 && img_title_value !== (img_title_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name)) {
    				attr_dev(img, "title", img_title_value);
    			}

    			if (!current || dirty & /*files, fileIdx*/ 3 && !src_url_equal(img.src, img_src_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].getWS(false))) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FullScreen', slots, []);
    	let { files } = $$props;
    	let { fileIdx } = $$props;
    	const dispatch = createEventDispatcher();
    	let manager;

    	onMount(() => {
    		document.addEventListener('keydown', handleKeyboardEvent);
    		manager = new hammer.Manager(document.getElementById("img-container"));
    		manager.add(new hammer.Swipe());
    		manager.on('swipeleft', next);
    		manager.on('swiperight', prev);
    	});

    	onDestroy(() => {
    		document.removeEventListener('keydown', handleKeyboardEvent);
    		manager.destroy();
    	});

    	// adapted from https://siongui.github.io/2012/06/25/javascript-keyboard-event-arrow-key-example/
    	function handleKeyboardEvent(evt) {
    		const keycode = evt.keyCode || evt.which;

    		switch (keycode) {
    			case 37:
    				// Left
    				prev();
    				break;
    			case 39:
    				// Right
    				next();
    				break;
    		}
    	}

    	function stepMode() {
    		dispatch("stepMode", {});
    	}

    	function next() {
    		const next = files.findIndex((f, i) => {
    			return i > fileIdx && isMimeTypeImage(f.mimeType);
    		});

    		if (next < 0) $$invalidate(0, fileIdx = files.findIndex(f => {
    			return isMimeTypeImage(f.mimeType);
    		})); else $$invalidate(0, fileIdx = next);
    	}

    	function prev() {
    		function findLastIndex(array, predicate) {
    			let l = array.length;

    			while (l--) {
    				if (predicate(array[l], l, array)) return l;
    			}

    			return -1;
    		}

    		const prev = findLastIndex(files, (f, i) => {
    			return i < fileIdx && isMimeTypeImage(f.mimeType);
    		});

    		if (prev < 0) $$invalidate(0, fileIdx = findLastIndex(files, f => {
    			return isMimeTypeImage(f.mimeType);
    		})); else $$invalidate(0, fileIdx = prev);
    	}

    	const writable_props = ['files', 'fileIdx'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FullScreen> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('files' in $$props) $$invalidate(1, files = $$props.files);
    		if ('fileIdx' in $$props) $$invalidate(0, fileIdx = $$props.fileIdx);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		onMount,
    		fade,
    		Hammer,
    		isMimeTypeImage,
    		files,
    		fileIdx,
    		dispatch,
    		manager,
    		handleKeyboardEvent,
    		stepMode,
    		next,
    		prev
    	});

    	$$self.$inject_state = $$props => {
    		if ('files' in $$props) $$invalidate(1, files = $$props.files);
    		if ('fileIdx' in $$props) $$invalidate(0, fileIdx = $$props.fileIdx);
    		if ('manager' in $$props) manager = $$props.manager;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [fileIdx, files, stepMode];
    }

    class FullScreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { files: 1, fileIdx: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FullScreen",
    			options,
    			id: create_fragment$v.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*files*/ ctx[1] === undefined && !('files' in props)) {
    			console.warn("<FullScreen> was created without expected prop 'files'");
    		}

    		if (/*fileIdx*/ ctx[0] === undefined && !('fileIdx' in props)) {
    			console.warn("<FullScreen> was created without expected prop 'fileIdx'");
    		}
    	}

    	get files() {
    		throw new Error("<FullScreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<FullScreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fileIdx() {
    		throw new Error("<FullScreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileIdx(value) {
    		throw new Error("<FullScreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Preview\FullSize.svelte generated by Svelte v3.49.0 */
    const file_1 = "src\\Preview\\FullSize.svelte";

    function create_fragment$u(ctx) {
    	let div;
    	let div_transition;
    	let t;
    	let img_1;
    	let img_1_alt_value;
    	let img_1_title_value;
    	let img_1_src_value;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			img_1 = element("img");
    			attr_dev(div, "class", "blanket blanket-very-clear");
    			add_location(div, file_1, 45, 0, 1444);
    			attr_dev(img_1, "id", "image");
    			attr_dev(img_1, "alt", img_1_alt_value = /*file*/ ctx[0].name);
    			attr_dev(img_1, "title", img_1_title_value = /*file*/ ctx[0].name);
    			attr_dev(img_1, "class", "top-left cursor-zoom-out shadow-5 svelte-ulvr4n");
    			attr_dev(img_1, "draggable", "false");
    			attr_dev(img_1, "ondragstart", "return false;");
    			if (!src_url_equal(img_1.src, img_1_src_value = /*file*/ ctx[0].getWS(false))) attr_dev(img_1, "src", img_1_src_value);
    			add_location(img_1, file_1, 46, 0, 1507);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, img_1, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img_1, "click", /*stepMode*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*file*/ 1 && img_1_alt_value !== (img_1_alt_value = /*file*/ ctx[0].name)) {
    				attr_dev(img_1, "alt", img_1_alt_value);
    			}

    			if (!current || dirty & /*file*/ 1 && img_1_title_value !== (img_1_title_value = /*file*/ ctx[0].name)) {
    				attr_dev(img_1, "title", img_1_title_value);
    			}

    			if (!current || dirty & /*file*/ 1 && !src_url_equal(img_1.src, img_1_src_value = /*file*/ ctx[0].getWS(false))) {
    				attr_dev(img_1, "src", img_1_src_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(img_1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FullSize', slots, []);
    	let { file } = $$props;
    	const dispatch = createEventDispatcher();

    	async function stepMode() {
    		dispatch("stepMode", {});
    	}

    	let img;

    	onMount(() => {
    		const img = document.getElementById("image");
    		const ww = window.innerWidth;
    		const wh = window.innerHeight;
    		const iw = img.clientWidth;
    		const ih = img.clientHeight;
    		if (ww > iw) img.style.left = (ww - iw) / 2 + "px";
    		if (wh > ih) img.style.top = (wh - ih) / 2 + "px";
    	});

    	const writable_props = ['file'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FullSize> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		fade,
    		file,
    		dispatch,
    		stepMode,
    		img
    	});

    	$$self.$inject_state = $$props => {
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('img' in $$props) img = $$props.img;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [file, stepMode];
    }

    class FullSize extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { file: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FullSize",
    			options,
    			id: create_fragment$u.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*file*/ ctx[0] === undefined && !('file' in props)) {
    			console.warn("<FullSize> was created without expected prop 'file'");
    		}
    	}

    	get file() {
    		throw new Error("<FullSize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<FullSize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Preview\Preview.svelte generated by Svelte v3.49.0 */

    // (40:0) {:else}
    function create_else_block$5(ctx) {
    	let fullsize;
    	let current;

    	fullsize = new FullSize({
    			props: {
    				file: /*files*/ ctx[1][/*fileIdx*/ ctx[0]]
    			},
    			$$inline: true
    		});

    	fullsize.$on("stepMode", /*doStepMode*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(fullsize.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fullsize, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fullsize_changes = {};
    			if (dirty & /*files, fileIdx*/ 3) fullsize_changes.file = /*files*/ ctx[1][/*fileIdx*/ ctx[0]];
    			fullsize.$set(fullsize_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fullsize.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fullsize.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fullsize, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(40:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:20) 
    function create_if_block_1$5(ctx) {
    	let fullscreen;
    	let updating_fileIdx;
    	let current;

    	function fullscreen_fileIdx_binding(value) {
    		/*fullscreen_fileIdx_binding*/ ctx[6](value);
    	}

    	let fullscreen_props = { files: /*files*/ ctx[1] };

    	if (/*fileIdx*/ ctx[0] !== void 0) {
    		fullscreen_props.fileIdx = /*fileIdx*/ ctx[0];
    	}

    	fullscreen = new FullScreen({ props: fullscreen_props, $$inline: true });
    	binding_callbacks.push(() => bind(fullscreen, 'fileIdx', fullscreen_fileIdx_binding));
    	fullscreen.$on("stepMode", /*doStepMode*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(fullscreen.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fullscreen, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fullscreen_changes = {};
    			if (dirty & /*files*/ 2) fullscreen_changes.files = /*files*/ ctx[1];

    			if (!updating_fileIdx && dirty & /*fileIdx*/ 1) {
    				updating_fileIdx = true;
    				fullscreen_changes.fileIdx = /*fileIdx*/ ctx[0];
    				add_flush_callback(() => updating_fileIdx = false);
    			}

    			fullscreen.$set(fullscreen_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fullscreen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fullscreen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fullscreen, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(38:20) ",
    		ctx
    	});

    	return block;
    }

    // (36:0) {#if mode == 0}
    function create_if_block$7(ctx) {
    	let slideshow;
    	let updating_fileIdx;
    	let current;

    	function slideshow_fileIdx_binding(value) {
    		/*slideshow_fileIdx_binding*/ ctx[4](value);
    	}

    	let slideshow_props = { files: /*files*/ ctx[1] };

    	if (/*fileIdx*/ ctx[0] !== void 0) {
    		slideshow_props.fileIdx = /*fileIdx*/ ctx[0];
    	}

    	slideshow = new Slideshow({ props: slideshow_props, $$inline: true });
    	binding_callbacks.push(() => bind(slideshow, 'fileIdx', slideshow_fileIdx_binding));
    	slideshow.$on("stepMode", /*doStepMode*/ ctx[3]);
    	slideshow.$on("closePreview", /*closePreview_handler*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(slideshow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(slideshow, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const slideshow_changes = {};
    			if (dirty & /*files*/ 2) slideshow_changes.files = /*files*/ ctx[1];

    			if (!updating_fileIdx && dirty & /*fileIdx*/ 1) {
    				updating_fileIdx = true;
    				slideshow_changes.fileIdx = /*fileIdx*/ ctx[0];
    				add_flush_callback(() => updating_fileIdx = false);
    			}

    			slideshow.$set(slideshow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(slideshow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(slideshow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(slideshow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(36:0) {#if mode == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_if_block_1$5, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*mode*/ ctx[2] == 0) return 0;
    		if (/*mode*/ ctx[2] == 1) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let mode;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Preview', slots, []);
    	let { files } = $$props;
    	let { fileIdx } = $$props;
    	let lastChange = 0;

    	function doStepMode() {
    		if (Date.now() - lastChange > 200) $$invalidate(2, mode = (mode + 1) % 3);
    	}

    	const writable_props = ['files', 'fileIdx'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Preview> was created with unknown prop '${key}'`);
    	});

    	function slideshow_fileIdx_binding(value) {
    		fileIdx = value;
    		$$invalidate(0, fileIdx);
    	}

    	function closePreview_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function fullscreen_fileIdx_binding(value) {
    		fileIdx = value;
    		$$invalidate(0, fileIdx);
    	}

    	$$self.$$set = $$props => {
    		if ('files' in $$props) $$invalidate(1, files = $$props.files);
    		if ('fileIdx' in $$props) $$invalidate(0, fileIdx = $$props.fileIdx);
    	};

    	$$self.$capture_state = () => ({
    		Slideshow,
    		FullScreen,
    		FullSize,
    		files,
    		fileIdx,
    		lastChange,
    		doStepMode,
    		mode
    	});

    	$$self.$inject_state = $$props => {
    		if ('files' in $$props) $$invalidate(1, files = $$props.files);
    		if ('fileIdx' in $$props) $$invalidate(0, fileIdx = $$props.fileIdx);
    		if ('lastChange' in $$props) lastChange = $$props.lastChange;
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*fileIdx, mode*/ 5) {
    			{
    				lastChange = Date.now();
    			}
    		}
    	};

    	$$invalidate(2, mode = 0); // 0=slideshow; 1=fullscreen; 2=full size

    	return [
    		fileIdx,
    		files,
    		mode,
    		doStepMode,
    		slideshow_fileIdx_binding,
    		closePreview_handler,
    		fullscreen_fileIdx_binding
    	];
    }

    class Preview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { files: 1, fileIdx: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Preview",
    			options,
    			id: create_fragment$t.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*files*/ ctx[1] === undefined && !('files' in props)) {
    			console.warn("<Preview> was created without expected prop 'files'");
    		}

    		if (/*fileIdx*/ ctx[0] === undefined && !('fileIdx' in props)) {
    			console.warn("<Preview> was created without expected prop 'fileIdx'");
    		}
    	}

    	get files() {
    		throw new Error("<Preview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<Preview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fileIdx() {
    		throw new Error("<Preview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileIdx(value) {
    		throw new Error("<Preview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var __defProp = Object.defineProperty;
    var __pow = Math.pow;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __publicField = (obj, key, value) => {
      __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
      return value;
    };
    var __accessCheck = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    var __privateGet = (obj, member, getter) => {
      __accessCheck(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    var __privateAdd = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    var __privateSet = (obj, member, value, setter) => {
      __accessCheck(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    var __privateWrapper = (obj, member, setter, getter) => {
      return {
        set _(value) {
          __privateSet(obj, member, value, setter);
        },
        get _() {
          return __privateGet(obj, member, getter);
        }
      };
    };
    var __privateMethod = (obj, member, method) => {
      __accessCheck(obj, member, "access private method");
      return method;
    };
    var _draggedPositionX, _isAnimated, _children, _totalMediaToLoad, _loadedMediaCount, _isResizing, _isScrolling, _isPressed, _deltaX, _deltaY, _windowResizeRef, _arrowPrev, _arrowNext, _arrowNextRef, _arrowPrevRef, _touchStartRef, _touchMoveRef, _touchReleaseRef, _xStart, _yStart, _indicators, _autoplayInterval, _pointerType, _getChildren, getChildren_fn, _waitForLoad, waitForLoad_fn, _newItemLoaded, newItemLoaded_fn, _setItemsPosition, setItemsPosition_fn, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn, _handleDragStart, handleDragStart_fn, _handleDragMove, handleDragMove_fn, _handleDragRelease, handleDragRelease_fn, _enableIndicators, enableIndicators_fn, _handleIndicatorClick, handleIndicatorClick_fn, _resetIndicators, resetIndicators_fn, _setTransitionDuration, setTransitionDuration_fn, _emitSlideEvent, emitSlideEvent_fn, _triggers, _sidenavTriggers, _isInit, _isActive, _isAnimated2, _childIsActive, _listenerRef, _resizeRef, _sidenavId, _handleResize, handleResize_fn, _detectSidenav, detectSidenav_fn, _addActiveInSidenav, addActiveInSidenav_fn, _toggleTriggerActive, toggleTriggerActive_fn, _autoClose, autoClose_fn, _applyOverflow, applyOverflow_fn, _onClickTrigger, onClickTrigger_fn, _triggers2, _isActive2, _isAnimated3, _isFixed, _firstSidenavInit, _layoutEl, _overlayElement, _listenerRef2, _windowResizeRef2, _windowWidth, _resizeHandler, resizeHandler_fn, _cleanLayout, cleanLayout_fn, _handleMultipleSidenav, handleMultipleSidenav_fn, _toggleBodyScroll, toggleBodyScroll_fn, _onClickTrigger2, onClickTrigger_fn2, _dropdownContent, _trigger, _isAnimated4, _isActive3, _documentClickRef, _listenerRef3, _contentHeightRef, _setupAnimation, setupAnimation_fn, _onDocumentClick, onDocumentClick_fn, _onClickTrigger3, onClickTrigger_fn3, _autoClose2, autoClose_fn2, _setContentHeight, setContentHeight_fn, _isAnimated5, _isActive4, _trigger2, _fabMenu, _openRef, _closeRef, _documentClickRef2, _listenerRef4, _verifOptions, verifOptions_fn, _setProperties, setProperties_fn, _setMenuPosition, setMenuPosition_fn, _handleDocumentClick, handleDocumentClick_fn, _onClickTrigger4, onClickTrigger_fn4, _onClickRef, _transitionEndEventRef, _keyUpRef, _scrollRef, _resizeRef2, _overlay, _overlayClickEventRef, _overflowParents, _baseRect, _newHeight, _newWidth, _isActive5, _isResponsive, _container, _isClosing, _isOpening, _setOverlay, setOverlay_fn, _showOverlay, showOverlay_fn, _hideOverlay, hideOverlay_fn, _unsetOverlay, unsetOverlay_fn, _calculateRatio, calculateRatio_fn, _setOverflowParents, setOverflowParents_fn, _unsetOverflowParents, unsetOverflowParents_fn, _handleTransition, handleTransition_fn, _handleKeyUp, handleKeyUp_fn, _handleScroll, handleScroll_fn, _handleResize2, _clearLightbox, clearLightbox_fn, _onClickTrigger5, onClickTrigger_fn5, _triggers3, _isActive6, _isAnimated6, _listenerRef5, _toggleBodyScroll2, toggleBodyScroll_fn2, _setZIndex, setZIndex_fn, _onClickTrigger6, onClickTrigger_fn6, _tabArrow, _tabLinks, _tabMenu, _currentItemIndex, _leftArrow, _rightArrow, _scrollLeftRef, _scrollRightRef, _arrowRef, _caroulixSlideRef, _resizeTabRef, _tabItems, _tabCaroulix, _tabCaroulixInit, _caroulixInstance, _isAnimated7, _handleResizeEvent, handleResizeEvent_fn, _handleCaroulixSlide, handleCaroulixSlide_fn, _getItems, getItems_fn, _hideContent, hideContent_fn, _enableSlideAnimation, enableSlideAnimation_fn, _setActiveElement, setActiveElement_fn, _toggleArrowMode, toggleArrowMode_fn, _scrollLeft, scrollLeft_fn, _scrollRight, scrollRight_fn, _onClickItem, onClickItem_fn, _getPreviousItemIndex, getPreviousItemIndex_fn, _getNextItemIndex, getNextItemIndex_fn, _oldLink, _updateRef, _links, _elements, _setupBasic, setupBasic_fn, _setupAuto, setupAuto_fn, _getElement, getElement_fn, _removeOldLink, removeOldLink_fn, _getClosestElem, getClosestElem_fn, _update, update_fn, _content, _toasters, _pointerType2, _touchStartRef2, _touchMoveRef2, _touchReleaseRef2, _isPressed2, _xStart2, _createToaster, createToaster_fn, _removeToaster, removeToaster_fn, _fadeInToast, fadeInToast_fn, _fadeOutToast, fadeOutToast_fn, _animOut, animOut_fn, _setupSwipeListeners, setupSwipeListeners_fn, _handleDragStart2, handleDragStart_fn2, _handleDragMove2, handleDragMove_fn2, _handleDragRelease2, handleDragRelease_fn2, _handleSwipe, handleSwipe_fn, _createToast, createToast_fn, _hide, hide_fn, _tooltip, _positionList, _listenerEnterRef, _listenerLeaveRef, _listenerResizeRef, _timeoutRef, _elRect, _tooltipRect, _setProperties2, setProperties_fn2, _setBasicPosition, setBasicPosition_fn, _manualTransform, manualTransform_fn, _onHover, onHover_fn, _onHoverOut, onHoverOut_fn, _dropdownInstance, _container2, _input, _label, _clickRef, _setupDropdown, setupDropdown_fn, _createCheckbox, createCheckbox_fn, _setupContent, setupContent_fn, _setFocusedClass, setFocusedClass_fn, _onClick, onClick_fn, _select, select_fn, _unSelect, unSelect_fn;
    const instances = [];
    const config = {
      components: [],
      plugins: [],
      prefix: "ax",
      mode: ""
    };
    const getCssVar = (variable) => `--${config.prefix}-${variable}`;
    const getComponentClass = (component) => config.components.find((c) => c.name === component).class;
    const getDataElements = () => {
      const dataComponents = config.components.filter((component) => component.dataDetection);
      const dataPlugins = config.plugins.filter((plugin) => plugin.dataDetection);
      return [...dataComponents, ...dataPlugins].map((el) => el.name);
    };
    const register = (el, term) => {
      if (!el.name || !el.class) {
        console.error(`[Axentix] Error registering ${term} : Missing required parameters.`);
        return;
      }
      if (config[term].some((elem) => elem.name === el.name)) {
        console.error(`[Axentix] Error registering ${term} : Already exist.`);
        return;
      }
      if (el.autoInit)
        el.autoInit.selector = el.autoInit.selector += ":not(.no-axentix-init)";
      config[term].push(el);
    };
    const registerComponent = (component) => {
      register(component, "components");
    };
    const getFormattedName = (name) => {
      return name.replace(/[\w]([A-Z])/g, (s) => {
        return s[0] + "-" + s[1];
      }).toLowerCase();
    };
    const getName = (name, baseName = "") => {
      const fmtName = getFormattedName(name);
      return baseName ? baseName + "-" + fmtName : fmtName;
    };
    const getOptionsForObject = (obj, name, component, element, baseName = "") => {
      const tmpOptName = name[0].toUpperCase() + name.slice(1).toLowerCase();
      if (getDataElements().includes(tmpOptName) && component !== "Collapsible" && tmpOptName !== "Sidenav")
        obj[name] = getComponentClass(tmpOptName).getDefaultOptions();
      const fmtName = baseName ? baseName + "-" + name : name;
      const keys = getOptions(obj[name], component, element, fmtName);
      if (!(Object.keys(keys).length === 0 && obj.constructor === Object))
        return keys;
    };
    const getOptions = (obj, component, element, baseName = "") => {
      return Object.keys(obj).reduce((acc, name) => {
        if (typeof obj[name] === "object" && obj[name] !== null) {
          const opts = getOptionsForObject(obj, name, component, element, baseName);
          if (opts)
            acc[name] = opts;
        } else if (obj[name] !== null) {
          const dataAttribute = "data-" + component.toLowerCase() + "-" + getName(name, baseName);
          if (element.hasAttribute(dataAttribute)) {
            const attr = element.getAttribute(dataAttribute);
            acc[name] = typeof obj[name] === "number" ? Number(attr) : attr;
            if (typeof obj[name] === "boolean")
              acc[name] = attr === "true";
          }
        }
        return acc;
      }, {});
    };
    const formatOptions = (component, element) => {
      const defaultOptions = Object.assign({}, getComponentClass(component).getDefaultOptions());
      return getOptions(defaultOptions, component, element);
    };
    const setup$1 = () => {
      const elements = document.querySelectorAll("[data-ax]");
      elements.forEach((el) => {
        let component = el.dataset.ax;
        component = component[0].toUpperCase() + component.slice(1).toLowerCase();
        if (!getDataElements().includes(component)) {
          console.error(`[Axentix] Error: ${component} component doesn't exist. 
 Did you forget to register him ?`, el);
          return;
        }
        try {
          const classDef = getComponentClass(component);
          new classDef(`#${el.id}`);
        } catch (error) {
          console.error("[Axentix] Data: Unable to load " + component, error);
        }
      });
    };
    const setupAll = () => {
      try {
        new Axentix.Axentix("all");
      } catch (error) {
        console.error("[Axentix] Unable to auto init.", error);
      }
    };
    document.addEventListener("DOMContentLoaded", () => {
      if (document.documentElement.dataset.axentix)
        setupAll();
      setup$1();
    });
    const extend = (...args) => {
      return args.reduce((acc, obj) => {
        for (let key in obj) {
          acc[key] = typeof obj[key] === "object" && obj[key] !== null ? extend(acc[key], obj[key]) : obj[key];
        }
        return acc;
      }, {});
    };
    const getComponentOptions = (component, options, el) => extend(getComponentClass(component).getDefaultOptions(), formatOptions(component, el), options);
    const wrap = (target, wrapper = document.createElement("div")) => {
      const parent = target[0].parentElement;
      parent.insertBefore(wrapper, target[0]);
      target.forEach((elem) => wrapper.appendChild(elem));
      return wrapper;
    };
    const unwrap = (wrapper) => wrapper.replaceWith(...wrapper.childNodes);
    const createEvent = (element, eventName, extraData) => {
      const event = new CustomEvent("ax." + eventName, {
        detail: extraData || {},
        bubbles: true
      });
      element.dispatchEvent(event);
    };
    const isTouchEnabled = () => "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    const isPointerEnabled = () => !!window.PointerEvent && "maxTouchPoints" in window.navigator && window.navigator.maxTouchPoints >= 0;
    const getPointerType = () => {
      if (isTouchEnabled())
        return "touch";
      else if (isPointerEnabled())
        return "pointer";
      return "mouse";
    };
    const getInstanceByType = (type) => instances.filter((ins) => ins.type === type).map((ins) => ins.instance);
    const getInstance = (element) => {
      const el = instances.find((ins) => ins.type !== "Toast" && "#" + ins.instance.el.id === element);
      if (el)
        return el.instance;
      return false;
    };
    const getUid = () => Math.random().toString().split(".")[1];
    const destroy = (element) => getInstance(element).destroy();
    const createOverlay = (isActive, overlay, id, animationDuration) => {
      const overlayElement = isActive && overlay ? document.querySelector(`.ax-overlay[data-target="${id}"]`) : document.createElement("div");
      overlayElement.classList.add("ax-overlay");
      overlayElement.style.transitionDuration = animationDuration + "ms";
      overlayElement.dataset.target = id;
      return overlayElement;
    };
    const updateOverlay = (overlay, overlayElement, listenerRef, state, animationDuration) => {
      if (!overlay)
        return;
      if (state) {
        overlayElement.addEventListener("click", listenerRef);
        document.body.appendChild(overlayElement);
        setTimeout(() => {
          overlayElement.classList.add("active");
        }, 50);
      } else {
        overlayElement.classList.remove("active");
        setTimeout(() => {
          overlayElement.removeEventListener("click", listenerRef);
          document.body.removeChild(overlayElement);
        }, animationDuration);
      }
    };
    const getTriggers = (id, query = '[data-target="{ID}"]') => Array.from(document.querySelectorAll(query.replace("{ID}", id)));
    const getClientYPosition = (e) => {
      if (e.targetTouches && e.targetTouches.length >= 1)
        return e.targetTouches[0].clientY;
      else if (e.changedTouches && e.changedTouches.length >= 1)
        return e.changedTouches[0].pageY;
      return e.clientY;
    };
    const getClientXPosition = (e) => {
      if (e.targetTouches && e.targetTouches.length >= 1)
        return e.targetTouches[0].clientX;
      else if (e.changedTouches && e.changedTouches.length >= 1)
        return e.changedTouches[0].pageX;
      return e.clientX;
    };
    const isDarkMode = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    class AxentixComponent {
      constructor() {
        __publicField(this, "el");
      }
      removeListeners() {
      }
      setupListeners() {
      }
      setup() {
      }
      preventDbInstance(element) {
        if (element && getInstance(element))
          throw new Error(`Instance already exist on ${element}`);
      }
      sync() {
        createEvent(this.el, "component.sync");
        this.removeListeners();
        this.setupListeners();
      }
      reset() {
        createEvent(this.el, "component.reset");
        this.removeListeners();
        this.setup();
      }
      destroy() {
        createEvent(this.el, "component.destroy");
        this.removeListeners();
        const index = instances.findIndex((ins) => ins.instance.el.id === this.el.id);
        instances.splice(index, 1);
      }
    }
    const CaroulixOptions = {
      animationDuration: 500,
      height: "",
      backToOpposite: true,
      enableTouch: true,
      indicators: {
        enabled: false,
        isFlat: false,
        customClasses: ""
      },
      autoplay: {
        enabled: true,
        interval: 5e3,
        side: "right"
      }
    };
    class Caroulix extends AxentixComponent {
      constructor(element, options) {
        super();
        __privateAdd(this, _getChildren);
        __privateAdd(this, _waitForLoad);
        __privateAdd(this, _newItemLoaded);
        __privateAdd(this, _setItemsPosition);
        __privateAdd(this, _setBasicCaroulixHeight);
        __privateAdd(this, _handleDragStart);
        __privateAdd(this, _handleDragMove);
        __privateAdd(this, _handleDragRelease);
        __privateAdd(this, _enableIndicators);
        __privateAdd(this, _handleIndicatorClick);
        __privateAdd(this, _resetIndicators);
        __privateAdd(this, _setTransitionDuration);
        __privateAdd(this, _emitSlideEvent);
        __publicField(this, "options");
        __publicField(this, "activeIndex");
        __privateAdd(this, _draggedPositionX, 0);
        __privateAdd(this, _isAnimated, false);
        __privateAdd(this, _children, void 0);
        __privateAdd(this, _totalMediaToLoad, 0);
        __privateAdd(this, _loadedMediaCount, 0);
        __privateAdd(this, _isResizing, false);
        __privateAdd(this, _isScrolling, false);
        __privateAdd(this, _isPressed, false);
        __privateAdd(this, _deltaX, 0);
        __privateAdd(this, _deltaY, 0);
        __privateAdd(this, _windowResizeRef, void 0);
        __privateAdd(this, _arrowPrev, void 0);
        __privateAdd(this, _arrowNext, void 0);
        __privateAdd(this, _arrowNextRef, void 0);
        __privateAdd(this, _arrowPrevRef, void 0);
        __privateAdd(this, _touchStartRef, void 0);
        __privateAdd(this, _touchMoveRef, void 0);
        __privateAdd(this, _touchReleaseRef, void 0);
        __privateAdd(this, _xStart, 0);
        __privateAdd(this, _yStart, 0);
        __privateAdd(this, _indicators, void 0);
        __privateAdd(this, _autoplayInterval, void 0);
        __privateAdd(this, _pointerType, void 0);
        try {
          this.preventDbInstance(element);
          instances.push({ type: "Caroulix", instance: this });
          this.el = document.querySelector(element);
          this.options = getComponentOptions("Caroulix", options, this.el);
          this.setup();
        } catch (error) {
          console.error("[Axentix] Caroulix init error", error);
        }
      }
      setup() {
        createEvent(this.el, "caroulix.setup");
        this.options.autoplay.side = this.options.autoplay.side.toLowerCase();
        const sideList = ["right", "left"];
        if (!sideList.includes(this.options.autoplay.side))
          this.options.autoplay.side = "right";
        this.activeIndex = 0;
        __privateSet(this, _draggedPositionX, 0);
        __privateSet(this, _isAnimated, false);
        __privateSet(this, _pointerType, getPointerType());
        __privateSet(this, _children, __privateMethod(this, _getChildren, getChildren_fn).call(this));
        if (this.options.indicators.enabled)
          __privateMethod(this, _enableIndicators, enableIndicators_fn).call(this);
        const activeEl = this.el.querySelector(".active");
        if (activeEl)
          this.activeIndex = __privateGet(this, _children).indexOf(activeEl);
        else
          __privateGet(this, _children)[0].classList.add("active");
        __privateMethod(this, _waitForLoad, waitForLoad_fn).call(this);
        if (__privateGet(this, _totalMediaToLoad) === 0)
          __privateMethod(this, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn).call(this);
        this.setupListeners();
        if (this.options.autoplay.enabled)
          this.play();
      }
      setupListeners() {
        __privateSet(this, _windowResizeRef, __privateMethod(this, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn).bind(this));
        window.addEventListener("resize", __privateGet(this, _windowResizeRef));
        if (__privateGet(this, _arrowNext)) {
          __privateSet(this, _arrowNextRef, this.next.bind(this, 1));
          __privateGet(this, _arrowNext).addEventListener("click", __privateGet(this, _arrowNextRef));
        }
        if (__privateGet(this, _arrowPrev)) {
          __privateSet(this, _arrowPrevRef, this.prev.bind(this, 1));
          __privateGet(this, _arrowPrev).addEventListener("click", __privateGet(this, _arrowPrevRef));
        }
        if (this.options.enableTouch) {
          __privateSet(this, _touchStartRef, __privateMethod(this, _handleDragStart, handleDragStart_fn).bind(this));
          __privateSet(this, _touchMoveRef, __privateMethod(this, _handleDragMove, handleDragMove_fn).bind(this));
          __privateSet(this, _touchReleaseRef, __privateMethod(this, _handleDragRelease, handleDragRelease_fn).bind(this));
          this.el.addEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "touch" ? "start" : "down"}`, __privateGet(this, _touchStartRef));
          this.el.addEventListener(`${__privateGet(this, _pointerType)}move`, __privateGet(this, _touchMoveRef));
          this.el.addEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "touch" ? "end" : "up"}`, __privateGet(this, _touchReleaseRef));
          this.el.addEventListener(__privateGet(this, _pointerType) === "pointer" ? "pointerleave" : "mouseleave", __privateGet(this, _touchReleaseRef));
        }
      }
      removeListeners() {
        window.removeEventListener("resize", __privateGet(this, _windowResizeRef));
        __privateSet(this, _windowResizeRef, void 0);
        if (__privateGet(this, _arrowNext)) {
          __privateGet(this, _arrowNext).removeEventListener("click", __privateGet(this, _arrowNextRef));
          __privateSet(this, _arrowNextRef, void 0);
        }
        if (__privateGet(this, _arrowPrev)) {
          __privateGet(this, _arrowPrev).removeEventListener("click", __privateGet(this, _arrowPrevRef));
          __privateSet(this, _arrowPrevRef, void 0);
        }
        if (this.options.enableTouch) {
          this.el.removeEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "pointer" ? "down" : "start"}`, __privateGet(this, _touchStartRef));
          this.el.removeEventListener(`${__privateGet(this, _pointerType)}move`, __privateGet(this, _touchMoveRef));
          this.el.removeEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "touch" ? "end" : "up"}`, __privateGet(this, _touchReleaseRef));
          this.el.removeEventListener(__privateGet(this, _pointerType) === "pointer" ? "pointerleave" : "mouseleave", __privateGet(this, _touchReleaseRef));
          __privateSet(this, _touchStartRef, void 0);
          __privateSet(this, _touchMoveRef, void 0);
          __privateSet(this, _touchReleaseRef, void 0);
        }
      }
      goTo(number) {
        if (number === this.activeIndex)
          return;
        const side = number > this.activeIndex ? "right" : "left";
        if (side === "left")
          this.prev(Math.abs(this.activeIndex - number));
        else
          this.next(Math.abs(this.activeIndex - number));
        if (this.options.indicators.enabled)
          __privateMethod(this, _resetIndicators, resetIndicators_fn).call(this);
      }
      play() {
        if (!this.options.autoplay.enabled)
          return;
        this.stop();
        __privateSet(this, _autoplayInterval, setInterval(() => {
          if (this.options.autoplay.side === "right")
            this.next(1, false);
          else
            this.prev(1, false);
        }, this.options.autoplay.interval));
      }
      stop() {
        if (!this.options.autoplay.enabled)
          return;
        clearInterval(__privateGet(this, _autoplayInterval));
      }
      next(step = 1, resetAutoplay = true) {
        if (__privateGet(this, _isResizing) || this.activeIndex === __privateGet(this, _children).length - 1 && !this.options.backToOpposite)
          return;
        createEvent(this.el, "caroulix.next", { step });
        __privateSet(this, _isAnimated, true);
        if (resetAutoplay && this.options.autoplay.enabled)
          this.stop();
        if (this.activeIndex < __privateGet(this, _children).length - 1)
          this.activeIndex += step;
        else if (this.options.backToOpposite)
          this.activeIndex = 0;
        __privateMethod(this, _emitSlideEvent, emitSlideEvent_fn).call(this);
        __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
        if (resetAutoplay && this.options.autoplay.enabled)
          this.play();
      }
      prev(step = 1, resetAutoplay = true) {
        if (__privateGet(this, _isResizing) || this.activeIndex === 0 && !this.options.backToOpposite)
          return;
        createEvent(this.el, "caroulix.prev", { step });
        __privateSet(this, _isAnimated, true);
        if (resetAutoplay && this.options.autoplay.enabled)
          this.stop();
        if (this.activeIndex > 0)
          this.activeIndex -= step;
        else if (this.options.backToOpposite)
          this.activeIndex = __privateGet(this, _children).length - 1;
        __privateMethod(this, _emitSlideEvent, emitSlideEvent_fn).call(this);
        __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
        if (resetAutoplay && this.options.autoplay.enabled)
          this.play();
      }
    }
    _draggedPositionX = new WeakMap();
    _isAnimated = new WeakMap();
    _children = new WeakMap();
    _totalMediaToLoad = new WeakMap();
    _loadedMediaCount = new WeakMap();
    _isResizing = new WeakMap();
    _isScrolling = new WeakMap();
    _isPressed = new WeakMap();
    _deltaX = new WeakMap();
    _deltaY = new WeakMap();
    _windowResizeRef = new WeakMap();
    _arrowPrev = new WeakMap();
    _arrowNext = new WeakMap();
    _arrowNextRef = new WeakMap();
    _arrowPrevRef = new WeakMap();
    _touchStartRef = new WeakMap();
    _touchMoveRef = new WeakMap();
    _touchReleaseRef = new WeakMap();
    _xStart = new WeakMap();
    _yStart = new WeakMap();
    _indicators = new WeakMap();
    _autoplayInterval = new WeakMap();
    _pointerType = new WeakMap();
    _getChildren = new WeakSet();
    getChildren_fn = function() {
      return Array.from(this.el.children).reduce((acc, child) => {
        if (child.classList.contains("caroulix-item"))
          acc.push(child);
        if (child.classList.contains("caroulix-prev"))
          __privateSet(this, _arrowPrev, child);
        if (child.classList.contains("caroulix-next"))
          __privateSet(this, _arrowNext, child);
        return acc;
      }, []);
    };
    _waitForLoad = new WeakSet();
    waitForLoad_fn = function() {
      __privateSet(this, _totalMediaToLoad, 0);
      __privateSet(this, _loadedMediaCount, 0);
      __privateGet(this, _children).forEach((item) => {
        const media = item.querySelector("img, video");
        if (media) {
          __privateWrapper(this, _totalMediaToLoad)._++;
          if (media.complete) {
            __privateMethod(this, _newItemLoaded, newItemLoaded_fn).call(this, media, true);
          } else {
            media.loadRef = __privateMethod(this, _newItemLoaded, newItemLoaded_fn).bind(this, media);
            media.addEventListener("load", media.loadRef);
          }
        }
      });
    };
    _newItemLoaded = new WeakSet();
    newItemLoaded_fn = function(media, alreadyLoad) {
      __privateWrapper(this, _loadedMediaCount)._++;
      if (!alreadyLoad) {
        media.removeEventListener("load", media.loadRef);
        media.loadRef = void 0;
      }
      if (__privateGet(this, _totalMediaToLoad) == __privateGet(this, _loadedMediaCount)) {
        __privateMethod(this, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn).call(this);
        __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this, true);
      }
    };
    _setItemsPosition = new WeakSet();
    setItemsPosition_fn = function(init = false) {
      const caroulixWidth = this.el.getBoundingClientRect().width;
      __privateGet(this, _children).forEach((child, index) => {
        child.style.transform = `translateX(${caroulixWidth * index - caroulixWidth * this.activeIndex - __privateGet(this, _draggedPositionX)}px)`;
      });
      if (this.options.indicators.enabled)
        __privateMethod(this, _resetIndicators, resetIndicators_fn).call(this);
      const activeElement = __privateGet(this, _children).find((child) => child.classList.contains("active"));
      activeElement.classList.remove("active");
      __privateGet(this, _children)[this.activeIndex].classList.add("active");
      setTimeout(() => {
        __privateSet(this, _isAnimated, false);
      }, this.options.animationDuration);
      if (init)
        setTimeout(() => __privateMethod(this, _setTransitionDuration, setTransitionDuration_fn).call(this, this.options.animationDuration), 50);
    };
    _setBasicCaroulixHeight = new WeakSet();
    setBasicCaroulixHeight_fn = function() {
      __privateSet(this, _isResizing, true);
      this.el.style.transitionDuration = "";
      if (this.options.autoplay.enabled)
        this.play();
      if (this.options.height) {
        this.el.style.height = this.options.height;
      } else {
        const childrenHeight = __privateGet(this, _children).map((child) => child.offsetHeight);
        const maxHeight = Math.max(...childrenHeight);
        this.el.style.height = maxHeight + "px";
      }
      __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
      setTimeout(() => {
        this.el.style.transitionDuration = this.options.animationDuration + "ms";
        __privateSet(this, _isResizing, false);
      }, 50);
    };
    _handleDragStart = new WeakSet();
    handleDragStart_fn = function(e) {
      if (e.target.closest(".caroulix-arrow") || e.target.closest(".caroulix-indicators") || __privateGet(this, _isAnimated))
        return;
      if (e.type !== "touchstart")
        e.preventDefault();
      if (this.options.autoplay.enabled)
        this.stop();
      __privateMethod(this, _setTransitionDuration, setTransitionDuration_fn).call(this, 0);
      __privateSet(this, _isPressed, true);
      __privateSet(this, _isScrolling, false);
      __privateSet(this, _deltaX, 0);
      __privateSet(this, _deltaY, 0);
      __privateSet(this, _xStart, getClientXPosition(e));
      __privateSet(this, _yStart, getClientYPosition(e));
    };
    _handleDragMove = new WeakSet();
    handleDragMove_fn = function(e) {
      if (!__privateGet(this, _isPressed) || __privateGet(this, _isScrolling))
        return;
      let x = getClientXPosition(e), y = getClientYPosition(e);
      __privateSet(this, _deltaX, __privateGet(this, _xStart) - x);
      __privateSet(this, _deltaY, Math.abs(__privateGet(this, _yStart) - y));
      if (e.type === "touchmove" && __privateGet(this, _deltaY) > Math.abs(__privateGet(this, _deltaX))) {
        __privateSet(this, _isScrolling, true);
        __privateSet(this, _deltaX, 0);
        return false;
      }
      if (e.cancelable)
        e.preventDefault();
      __privateSet(this, _draggedPositionX, __privateGet(this, _deltaX));
      __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
    };
    _handleDragRelease = new WeakSet();
    handleDragRelease_fn = function(e) {
      if (e.target.closest(".caroulix-arrow") || e.target.closest(".caroulix-indicators"))
        return;
      if (e.cancelable)
        e.preventDefault();
      if (__privateGet(this, _isPressed)) {
        __privateMethod(this, _setTransitionDuration, setTransitionDuration_fn).call(this, this.options.animationDuration);
        let caroulixWidth = this.el.getBoundingClientRect().width;
        __privateSet(this, _isPressed, false);
        const percent = caroulixWidth * 15 / 100;
        if (this.activeIndex !== __privateGet(this, _children).length - 1 && __privateGet(this, _deltaX) > percent) {
          this.next();
        } else if (this.activeIndex !== 0 && __privateGet(this, _deltaX) < -percent) {
          this.prev();
        }
        __privateSet(this, _deltaX, 0);
        __privateSet(this, _draggedPositionX, 0);
        __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
        if (this.options.autoplay.enabled)
          this.play();
      }
    };
    _enableIndicators = new WeakSet();
    enableIndicators_fn = function() {
      __privateSet(this, _indicators, document.createElement("ul"));
      __privateGet(this, _indicators).classList.add("caroulix-indicators");
      if (this.options.indicators.isFlat)
        __privateGet(this, _indicators).classList.add("caroulix-flat");
      if (this.options.indicators.customClasses)
        __privateGet(this, _indicators).className = `${__privateGet(this, _indicators).className} ${this.options.indicators.customClasses}`;
      for (let i = 0; i < __privateGet(this, _children).length; i++) {
        const li = document.createElement("li");
        li.triggerRef = __privateMethod(this, _handleIndicatorClick, handleIndicatorClick_fn).bind(this, i);
        li.addEventListener("click", li.triggerRef);
        __privateGet(this, _indicators).appendChild(li);
      }
      this.el.appendChild(__privateGet(this, _indicators));
    };
    _handleIndicatorClick = new WeakSet();
    handleIndicatorClick_fn = function(i, e) {
      e.preventDefault();
      if (i === this.activeIndex)
        return;
      this.goTo(i);
    };
    _resetIndicators = new WeakSet();
    resetIndicators_fn = function() {
      Array.from(__privateGet(this, _indicators).children).forEach((li) => li.removeAttribute("class"));
      __privateGet(this, _indicators).children[this.activeIndex].classList.add("active");
    };
    _setTransitionDuration = new WeakSet();
    setTransitionDuration_fn = function(duration) {
      this.el.style.transitionDuration = duration + "ms";
    };
    _emitSlideEvent = new WeakSet();
    emitSlideEvent_fn = function() {
      createEvent(this.el, "caroulix.slide", {
        nextElement: __privateGet(this, _children)[this.activeIndex],
        currentElement: __privateGet(this, _children)[__privateGet(this, _children).findIndex((child) => child.classList.contains("active"))]
      });
    };
    __publicField(Caroulix, "getDefaultOptions", () => CaroulixOptions);
    registerComponent({
      class: Caroulix,
      name: "Caroulix",
      dataDetection: true,
      autoInit: {
        enabled: true,
        selector: ".caroulix"
      }
    });
    const CollapsibleOptions = {
      animationDuration: 300,
      sidenav: {
        activeClass: true,
        activeWhenOpen: true,
        autoClose: true
      }
    };
    class Collapsible extends AxentixComponent {
      constructor(element, options) {
        super();
        __privateAdd(this, _handleResize);
        __privateAdd(this, _detectSidenav);
        __privateAdd(this, _addActiveInSidenav);
        __privateAdd(this, _toggleTriggerActive);
        __privateAdd(this, _autoClose);
        __privateAdd(this, _applyOverflow);
        __privateAdd(this, _onClickTrigger);
        __publicField(this, "options");
        __privateAdd(this, _triggers, void 0);
        __privateAdd(this, _sidenavTriggers, void 0);
        __privateAdd(this, _isInit, true);
        __privateAdd(this, _isActive, false);
        __privateAdd(this, _isAnimated2, false);
        __privateAdd(this, _childIsActive, false);
        __privateAdd(this, _listenerRef, void 0);
        __privateAdd(this, _resizeRef, void 0);
        __privateAdd(this, _sidenavId, void 0);
        try {
          this.preventDbInstance(element);
          instances.push({ type: "Collapsible", instance: this });
          this.el = document.querySelector(element);
          this.options = getComponentOptions("Collapsible", options, this.el);
          this.setup();
        } catch (error) {
          console.error("[Axentix] Collapsible init error", error);
        }
      }
      setup() {
        createEvent(this.el, "collapsible.setup");
        __privateSet(this, _triggers, getTriggers(this.el.id));
        __privateSet(this, _isInit, true);
        __privateSet(this, _isActive, this.el.classList.contains("active") ? true : false);
        __privateSet(this, _isAnimated2, false);
        __privateSet(this, _sidenavId, "");
        __privateSet(this, _childIsActive, false);
        this.setupListeners();
        this.el.style.transitionDuration = this.options.animationDuration + "ms";
        __privateMethod(this, _detectSidenav, detectSidenav_fn).call(this);
        __privateSet(this, _childIsActive, this.el.querySelector(".active") ? true : false);
        if (this.options.sidenav.activeClass)
          __privateMethod(this, _addActiveInSidenav, addActiveInSidenav_fn).call(this);
        if (__privateGet(this, _isActive))
          this.open();
        __privateSet(this, _isInit, false);
      }
      setupListeners() {
        __privateSet(this, _listenerRef, __privateMethod(this, _onClickTrigger, onClickTrigger_fn).bind(this));
        __privateGet(this, _triggers).forEach((trigger) => trigger.addEventListener("click", __privateGet(this, _listenerRef)));
        __privateSet(this, _resizeRef, __privateMethod(this, _handleResize, handleResize_fn).bind(this));
        window.addEventListener("resize", __privateGet(this, _resizeRef));
      }
      removeListeners() {
        __privateGet(this, _triggers).forEach((trigger) => trigger.removeEventListener("click", __privateGet(this, _listenerRef)));
        __privateSet(this, _listenerRef, void 0);
        window.removeEventListener("resize", __privateGet(this, _resizeRef));
        __privateSet(this, _resizeRef, void 0);
      }
      open() {
        if (__privateGet(this, _isActive) && !__privateGet(this, _isInit))
          return;
        createEvent(this.el, "collapsible.open");
        __privateSet(this, _isActive, true);
        __privateSet(this, _isAnimated2, true);
        this.el.style.display = "block";
        __privateMethod(this, _applyOverflow, applyOverflow_fn).call(this);
        this.el.style.maxHeight = this.el.scrollHeight + "px";
        if (this.options.sidenav.activeWhenOpen)
          __privateMethod(this, _toggleTriggerActive, toggleTriggerActive_fn).call(this, true);
        if (this.options.sidenav.autoClose)
          __privateMethod(this, _autoClose, autoClose_fn).call(this);
        setTimeout(() => {
          __privateSet(this, _isAnimated2, false);
        }, this.options.animationDuration);
      }
      close() {
        if (!__privateGet(this, _isActive))
          return;
        createEvent(this.el, "collapsible.close");
        __privateSet(this, _isAnimated2, true);
        this.el.style.maxHeight = "";
        __privateMethod(this, _applyOverflow, applyOverflow_fn).call(this);
        if (this.options.sidenav.activeWhenOpen)
          __privateMethod(this, _toggleTriggerActive, toggleTriggerActive_fn).call(this, false);
        setTimeout(() => {
          this.el.style.display = "";
          __privateSet(this, _isAnimated2, false);
          __privateSet(this, _isActive, false);
        }, this.options.animationDuration);
      }
    }
    _triggers = new WeakMap();
    _sidenavTriggers = new WeakMap();
    _isInit = new WeakMap();
    _isActive = new WeakMap();
    _isAnimated2 = new WeakMap();
    _childIsActive = new WeakMap();
    _listenerRef = new WeakMap();
    _resizeRef = new WeakMap();
    _sidenavId = new WeakMap();
    _handleResize = new WeakSet();
    handleResize_fn = function() {
      if (__privateGet(this, _isActive) && !__privateGet(this, _sidenavId))
        this.el.style.maxHeight = this.el.scrollHeight + "px";
    };
    _detectSidenav = new WeakSet();
    detectSidenav_fn = function() {
      const sidenavElem = this.el.closest(".sidenav");
      if (sidenavElem) {
        __privateSet(this, _sidenavId, sidenavElem.id);
        __privateSet(this, _sidenavTriggers, __privateGet(this, _triggers).filter((t) => {
          var _a;
          return ((_a = t.closest(".sidenav")) == null ? void 0 : _a.id) === sidenavElem.id;
        }));
      }
    };
    _addActiveInSidenav = new WeakSet();
    addActiveInSidenav_fn = function() {
      if (!__privateGet(this, _childIsActive) || !__privateGet(this, _sidenavId))
        return;
      __privateGet(this, _sidenavTriggers).forEach((trigger) => trigger.classList.add("active"));
      this.el.classList.add("active");
      this.open();
      __privateSet(this, _isActive, true);
    };
    _toggleTriggerActive = new WeakSet();
    toggleTriggerActive_fn = function(state) {
      if (!__privateGet(this, _sidenavId))
        return;
      __privateGet(this, _sidenavTriggers).forEach((trigger) => {
        if (state)
          trigger.classList.add("active");
        else
          trigger.classList.remove("active");
      });
    };
    _autoClose = new WeakSet();
    autoClose_fn = function() {
      if (!__privateGet(this, _isInit) && __privateGet(this, _sidenavId)) {
        getInstanceByType("Collapsible").forEach((collapsible2) => {
          if (__privateGet(collapsible2, _sidenavId) === __privateGet(this, _sidenavId) && collapsible2.el.id !== this.el.id)
            collapsible2.close();
        });
      }
    };
    _applyOverflow = new WeakSet();
    applyOverflow_fn = function() {
      this.el.style.overflow = "hidden";
      setTimeout(() => {
        this.el.style.overflow = "";
      }, this.options.animationDuration);
    };
    _onClickTrigger = new WeakSet();
    onClickTrigger_fn = function(e) {
      e.preventDefault();
      if (__privateGet(this, _isAnimated2))
        return;
      if (__privateGet(this, _isActive))
        this.close();
      else
        this.open();
    };
    __publicField(Collapsible, "getDefaultOptions", () => CollapsibleOptions);
    registerComponent({
      class: Collapsible,
      name: "Collapsible",
      dataDetection: true,
      autoInit: {
        enabled: true,
        selector: ".collapsible"
      }
    });
    const SidenavOptions = {
      overlay: true,
      bodyScrolling: false,
      animationDuration: 300
    };
    class Sidenav extends AxentixComponent {
      constructor(element, options) {
        super();
        __privateAdd(this, _resizeHandler);
        __privateAdd(this, _cleanLayout);
        __privateAdd(this, _handleMultipleSidenav);
        __privateAdd(this, _toggleBodyScroll);
        __privateAdd(this, _onClickTrigger2);
        __publicField(this, "options");
        __privateAdd(this, _triggers2, void 0);
        __privateAdd(this, _isActive2, false);
        __privateAdd(this, _isAnimated3, false);
        __privateAdd(this, _isFixed, false);
        __privateAdd(this, _firstSidenavInit, false);
        __privateAdd(this, _layoutEl, void 0);
        __privateAdd(this, _overlayElement, void 0);
        __privateAdd(this, _listenerRef2, void 0);
        __privateAdd(this, _windowResizeRef2, void 0);
        __privateAdd(this, _windowWidth, void 0);
        try {
          this.preventDbInstance(element);
          instances.push({ type: "Sidenav", instance: this });
          this.el = document.querySelector(element);
          this.options = getComponentOptions("Sidenav", options, this.el);
          this.setup();
        } catch (error) {
          console.error("[Axentix] Sidenav init error", error);
        }
      }
      setup() {
        createEvent(this.el, "sidenav.setup");
        __privateSet(this, _triggers2, getTriggers(this.el.id));
        __privateSet(this, _isActive2, false);
        __privateSet(this, _isAnimated3, false);
        __privateSet(this, _windowWidth, window.innerWidth);
        __privateSet(this, _isFixed, this.el.classList.contains("sidenav-fixed"));
        const sidenavFixed = getInstanceByType("Sidenav").find((sidenav2) => __privateGet(sidenav2, _isFixed));
        __privateSet(this, _firstSidenavInit, sidenavFixed && sidenavFixed.el === this.el);
        __privateSet(this, _layoutEl, document.querySelector('.layout, [class*="layout-"]'));
        if (__privateGet(this, _layoutEl) && __privateGet(this, _firstSidenavInit))
          __privateMethod(this, _cleanLayout, cleanLayout_fn).call(this);
        this.setupListeners();
        if (this.options.overlay)
          __privateSet(this, _overlayElement, createOverlay(__privateGet(this, _isActive2), this.options.overlay, this.el.id, this.options.animationDuration));
        if (__privateGet(this, _layoutEl) && __privateGet(this, _isFixed))
          __privateMethod(this, _handleMultipleSidenav, handleMultipleSidenav_fn).call(this);
        this.el.style.transitionDuration = this.options.animationDuration + "ms";
      }
      setupListeners() {
        __privateSet(this, _listenerRef2, __privateMethod(this, _onClickTrigger2, onClickTrigger_fn2).bind(this));
        __privateGet(this, _triggers2).forEach((trigger) => trigger.addEventListener("click", __privateGet(this, _listenerRef2)));
        __privateSet(this, _windowResizeRef2, __privateMethod(this, _resizeHandler, resizeHandler_fn).bind(this));
        window.addEventListener("resize", __privateGet(this, _windowResizeRef2));
      }
      removeListeners() {
        __privateGet(this, _triggers2).forEach((trigger) => trigger.removeEventListener("click", __privateGet(this, _listenerRef2)));
        __privateSet(this, _listenerRef2, void 0);
        window.removeEventListener("resize", __privateGet(this, _windowResizeRef2));
        __privateSet(this, _windowResizeRef2, void 0);
      }
      destroy() {
        createEvent(this.el, "component.destroy");
        this.removeListeners();
        if (__privateGet(this, _layoutEl))
          __privateMethod(this, _cleanLayout, cleanLayout_fn).call(this);
        const index = instances.findIndex((ins) => ins.instance.el.id === this.el.id);
        instances.splice(index, 1);
      }
      open() {
        if (__privateGet(this, _isActive2) || __privateGet(this, _isAnimated3))
          return;
        createEvent(this.el, "sidenav.open");
        __privateSet(this, _isActive2, true);
        __privateSet(this, _isAnimated3, true);
        this.el.classList.add("active");
        updateOverlay(this.options.overlay, __privateGet(this, _overlayElement), __privateGet(this, _listenerRef2), true, this.options.animationDuration);
        __privateMethod(this, _toggleBodyScroll, toggleBodyScroll_fn).call(this, false);
        setTimeout(() => {
          __privateSet(this, _isAnimated3, false);
          createEvent(this.el, "sidenav.opened");
        }, this.options.animationDuration);
      }
      close() {
        if (!__privateGet(this, _isActive2) || __privateGet(this, _isAnimated3))
          return;
        __privateSet(this, _isAnimated3, true);
        createEvent(this.el, "sidenav.close");
        this.el.classList.remove("active");
        updateOverlay(this.options.overlay, __privateGet(this, _overlayElement), __privateGet(this, _listenerRef2), false, this.options.animationDuration);
        setTimeout(() => {
          __privateMethod(this, _toggleBodyScroll, toggleBodyScroll_fn).call(this, true);
          __privateSet(this, _isActive2, false);
          __privateSet(this, _isAnimated3, false);
          createEvent(this.el, "sidenav.closed");
        }, this.options.animationDuration);
      }
    }
    _triggers2 = new WeakMap();
    _isActive2 = new WeakMap();
    _isAnimated3 = new WeakMap();
    _isFixed = new WeakMap();
    _firstSidenavInit = new WeakMap();
    _layoutEl = new WeakMap();
    _overlayElement = new WeakMap();
    _listenerRef2 = new WeakMap();
    _windowResizeRef2 = new WeakMap();
    _windowWidth = new WeakMap();
    _resizeHandler = new WeakSet();
    resizeHandler_fn = function(e) {
      const target = e.target;
      const width = target.innerWidth;
      if (__privateGet(this, _windowWidth) !== width)
        this.close();
      __privateSet(this, _windowWidth, width);
    };
    _cleanLayout = new WeakSet();
    cleanLayout_fn = function() {
      ["layout-sidenav-right", "layout-sidenav-both"].forEach((classes) => __privateGet(this, _layoutEl).classList.remove(classes));
    };
    _handleMultipleSidenav = new WeakSet();
    handleMultipleSidenav_fn = function() {
      if (!__privateGet(this, _firstSidenavInit))
        return;
      const sidenavs = Array.from(document.querySelectorAll(".sidenav")).filter((sidenav2) => sidenav2.classList.contains("sidenav-fixed"));
      const { sidenavsRight, sidenavsLeft } = sidenavs.reduce((acc, sidenav2) => {
        sidenav2.classList.contains("sidenav-right") ? acc.sidenavsRight.push(sidenav2) : acc.sidenavsLeft.push(sidenav2);
        return acc;
      }, { sidenavsRight: [], sidenavsLeft: [] });
      const isBoth = sidenavsLeft.length > 0 && sidenavsRight.length > 0;
      if (sidenavsRight.length > 0 && !isBoth)
        __privateGet(this, _layoutEl).classList.add("layout-sidenav-right");
      else if (isBoth)
        __privateGet(this, _layoutEl).classList.add("layout-sidenav-both");
    };
    _toggleBodyScroll = new WeakSet();
    toggleBodyScroll_fn = function(state) {
      if (!this.options.bodyScrolling)
        document.body.style.overflow = state ? "" : "hidden";
    };
    _onClickTrigger2 = new WeakSet();
    onClickTrigger_fn2 = function(e) {
      e.preventDefault();
      if (__privateGet(this, _isFixed) && window.innerWidth >= 960)
        return;
      if (__privateGet(this, _isActive2))
        this.close();
      else
        this.open();
    };
    __publicField(Sidenav, "getDefaultOptions", () => SidenavOptions);
    registerComponent({
      class: Sidenav,
      name: "Sidenav",
      dataDetection: true,
      autoInit: {
        enabled: true,
        selector: ".sidenav"
      }
    });
    const DropdownOptions = {
      animationDuration: 300,
      animationType: "none",
      hover: false,
      autoClose: true,
      preventViewport: false,
      closeOnClick: true
    };
    class Dropdown extends AxentixComponent {
      constructor(element, options) {
        super();
        __privateAdd(this, _setupAnimation);
        __privateAdd(this, _onDocumentClick);
        __privateAdd(this, _onClickTrigger3);
        __privateAdd(this, _autoClose2);
        __privateAdd(this, _setContentHeight);
        __publicField(this, "options");
        __privateAdd(this, _dropdownContent, void 0);
        __privateAdd(this, _trigger, void 0);
        __privateAdd(this, _isAnimated4, false);
        __privateAdd(this, _isActive3, false);
        __privateAdd(this, _documentClickRef, void 0);
        __privateAdd(this, _listenerRef3, void 0);
        __privateAdd(this, _contentHeightRef, void 0);
        try {
          this.preventDbInstance(element);
          instances.push({ type: "Dropdown", instance: this });
          this.el = document.querySelector(element);
          this.options = getComponentOptions("Dropdown", options, this.el);
          this.setup();
        } catch (error) {
          console.error("[Axentix] Dropdown init error", error);
        }
      }
      setup() {
        createEvent(this.el, "dropdown.setup");
        __privateSet(this, _dropdownContent, this.el.querySelector(".dropdown-content"));
        __privateSet(this, _trigger, getTriggers(this.el.id)[0]);
        __privateSet(this, _isAnimated4, false);
        __privateSet(this, _isActive3, this.el.classList.contains("active") ? true : false);
        if (this.options.hover)
          this.el.classList.add("active-hover");
        else
          this.setupListeners();
        if (this.options.preventViewport)
          this.el.classList.add("dropdown-vp");
        __privateMethod(this, _setupAnimation, setupAnimation_fn).call(this);
      }
      setupListeners() {
        if (this.options.hover)
          return;
        __privateSet(this, _listenerRef3, __privateMethod(this, _onClickTrigger3, onClickTrigger_fn3).bind(this));
        __privateGet(this, _trigger).addEventListener("click", __privateGet(this, _listenerRef3));
        __privateSet(this, _documentClickRef, __privateMethod(this, _onDocumentClick, onDocumentClick_fn).bind(this));
        document.addEventListener("click", __privateGet(this, _documentClickRef), true);
        __privateSet(this, _contentHeightRef, __privateMethod(this, _setContentHeight, setContentHeight_fn).bind(this));
        if (this.options.preventViewport)
          window.addEventListener("scroll", __privateGet(this, _contentHeightRef));
      }
      removeListeners() {
        if (this.options.hover)
          return;
        __privateGet(this, _trigger).removeEventListener("click", __privateGet(this, _listenerRef3));
        __privateSet(this, _listenerRef3, void 0);
        document.removeEventListener("click", __privateGet(this, _documentClickRef), true);
        __privateSet(this, _documentClickRef, void 0);
        if (this.options.preventViewport)
          window.removeEventListener("scroll", __privateGet(this, _contentHeightRef));
        __privateSet(this, _contentHeightRef, void 0);
      }
      open() {
        if (__privateGet(this, _isActive3))
          return;
        createEvent(this.el, "dropdown.open");
        __privateGet(this, _dropdownContent).style.display = "flex";
        if (this.options.preventViewport)
          __privateMethod(this, _setContentHeight, setContentHeight_fn).call(this);
        setTimeout(() => {
          this.el.classList.add("active");
          __privateSet(this, _isActive3, true);
        }, 10);
        if (this.options.autoClose)
          __privateMethod(this, _autoClose2, autoClose_fn2).call(this);
        if (this.options.animationType !== "none") {
          __privateSet(this, _isAnimated4, true);
          setTimeout(() => {
            __privateSet(this, _isAnimated4, false);
            createEvent(this.el, "dropdown.opened");
          }, this.options.animationDuration);
        } else {
          createEvent(this.el, "dropdown.opened");
        }
      }
      close() {
        if (!__privateGet(this, _isActive3))
          return;
        createEvent(this.el, "dropdown.close");
        this.el.classList.remove("active");
        if (this.options.animationType !== "none") {
          __privateSet(this, _isAnimated4, true);
          setTimeout(() => {
            __privateGet(this, _dropdownContent).style.display = "";
            __privateSet(this, _isAnimated4, false);
            __privateSet(this, _isActive3, false);
            createEvent(this.el, "dropdown.closed");
          }, this.options.animationDuration);
        } else {
          __privateGet(this, _dropdownContent).style.display = "";
          __privateSet(this, _isActive3, false);
          createEvent(this.el, "dropdown.closed");
        }
      }
    }
    _dropdownContent = new WeakMap();
    _trigger = new WeakMap();
    _isAnimated4 = new WeakMap();
    _isActive3 = new WeakMap();
    _documentClickRef = new WeakMap();
    _listenerRef3 = new WeakMap();
    _contentHeightRef = new WeakMap();
    _setupAnimation = new WeakSet();
    setupAnimation_fn = function() {
      const animationList = ["none", "fade"];
      this.options.animationType = this.options.animationType.toLowerCase();
      if (!animationList.includes(this.options.animationType))
        this.options.animationType = "none";
      if (this.options.animationType === "fade" && !this.options.hover) {
        __privateGet(this, _dropdownContent).style.transitionDuration = this.options.animationDuration + "ms";
        this.el.classList.add("dropdown-anim-fade");
      }
    };
    _onDocumentClick = new WeakSet();
    onDocumentClick_fn = function(e) {
      if (e.target === __privateGet(this, _trigger) || __privateGet(this, _isAnimated4) || !__privateGet(this, _isActive3) || !this.options.closeOnClick && e.target.closest(".dropdown-content"))
        return;
      this.close();
    };
    _onClickTrigger3 = new WeakSet();
    onClickTrigger_fn3 = function(e) {
      e.preventDefault();
      if (__privateGet(this, _isAnimated4))
        return;
      if (__privateGet(this, _isActive3))
        this.close();
      else
        this.open();
    };
    _autoClose2 = new WeakSet();
    autoClose_fn2 = function() {
      getInstanceByType("Dropdown").forEach((dropdown2) => {
        if (dropdown2.el.id !== this.el.id)
          dropdown2.close();
      });
    };
    _setContentHeight = new WeakSet();
    setContentHeight_fn = function() {
      const elRect = __privateGet(this, _dropdownContent).getBoundingClientRect();
      const bottom = elRect.height - (elRect.bottom - (window.innerHeight || document.documentElement.clientHeight)) - 10;
      __privateGet(this, _dropdownContent).style.maxHeight = bottom + "px";
    };
    __publicField(Dropdown, "getDefaultOptions", () => DropdownOptions);
    registerComponent({
      class: Dropdown,
      name: "Dropdown",
      dataDetection: true,
      autoInit: {
        enabled: true,
        selector: ".dropdown"
      }
    });
    const FabOptions = {
      animationDuration: 300,
      hover: true,
      direction: "top",
      position: "bottom-right",
      offsetX: "1rem",
      offsetY: "1.5rem"
    };
    class Fab extends AxentixComponent {
      constructor(element, options) {
        super();
        __privateAdd(this, _verifOptions);
        __privateAdd(this, _setProperties);
        __privateAdd(this, _setMenuPosition);
        __privateAdd(this, _handleDocumentClick);
        __privateAdd(this, _onClickTrigger4);
        __publicField(this, "options");
        __privateAdd(this, _isAnimated5, false);
        __privateAdd(this, _isActive4, false);
        __privateAdd(this, _trigger2, void 0);
        __privateAdd(this, _fabMenu, void 0);
        __privateAdd(this, _openRef, void 0);
        __privateAdd(this, _closeRef, void 0);
        __privateAdd(this, _documentClickRef2, void 0);
        __privateAdd(this, _listenerRef4, void 0);
        try {
          this.preventDbInstance(element);
          instances.push({ type: "Fab", instance: this });
          this.el = document.querySelector(element);
          this.options = getComponentOptions("Fab", options, this.el);
          this.setup();
        } catch (error) {
          console.error("[Axentix] Fab init error", error);
        }
      }
      setup() {
        createEvent(this.el, "fab.setup");
        __privateSet(this, _isAnimated5, false);
        __privateSet(this, _isActive4, false);
        __privateSet(this, _trigger2, getTriggers(this.el.id)[0]);
        __privateSet(this, _fabMenu, this.el.querySelector(".fab-menu"));
        __privateMethod(this, _verifOptions, verifOptions_fn).call(this);
        this.setupListeners();
        this.el.style.transitionDuration = this.options.animationDuration + "ms";
        __privateMethod(this, _setProperties, setProperties_fn).call(this);
      }
      setupListeners() {
        if (this.options.hover) {
          __privateSet(this, _openRef, this.open.bind(this));
          __privateSet(this, _closeRef, this.close.bind(this));
          this.el.addEventListener("mouseenter", __privateGet(this, _openRef));
          this.el.addEventListener("mouseleave", __privateGet(this, _closeRef));
        } else {
          __privateSet(this, _listenerRef4, __privateMethod(this, _onClickTrigger4, onClickTrigger_fn4).bind(this));
          this.el.addEventListener("click", __privateGet(this, _listenerRef4));
        }
        __privateSet(this, _documentClickRef2, __privateMethod(this, _handleDocumentClick, handleDocumentClick_fn).bind(this));
        document.addEventListener("click", __privateGet(this, _documentClickRef2), true);
      }
      removeListeners() {
        if (this.options.hover) {
          this.el.removeEventListener("mouseenter", __privateGet(this, _openRef));
          this.el.removeEventListener("mouseleave", __privateGet(this, _closeRef));
          __privateSet(this, _openRef, void 0);
          __privateSet(this, _closeRef, void 0);
        } else {
          this.el.removeEventListener("click", __privateGet(this, _listenerRef4));
          __privateSet(this, _listenerRef4, void 0);
        }
        document.removeEventListener("click", __privateGet(this, _documentClickRef2), true);
        __privateSet(this, _documentClickRef2, void 0);
      }
      open() {
        if (__privateGet(this, _isActive4))
          return;
        createEvent(this.el, "fab.open");
        __privateSet(this, _isAnimated5, true);
        __privateSet(this, _isActive4, true);
        this.el.classList.add("active");
        setTimeout(() => {
          __privateSet(this, _isAnimated5, false);
        }, this.options.animationDuration);
      }
      close() {
        if (!__privateGet(this, _isActive4))
          return;
        createEvent(this.el, "fab.close");
        __privateSet(this, _isAnimated5, true);
        __privateSet(this, _isActive4, false);
        this.el.classList.remove("active");
        setTimeout(() => {
          __privateSet(this, _isAnimated5, false);
        }, this.options.animationDuration);
      }
    }
    _isAnimated5 = new WeakMap();
    _isActive4 = new WeakMap();
    _trigger2 = new WeakMap();
    _fabMenu = new WeakMap();
    _openRef = new WeakMap();
    _closeRef = new WeakMap();
    _documentClickRef2 = new WeakMap();
    _listenerRef4 = new WeakMap();
    _verifOptions = new WeakSet();
    verifOptions_fn = function() {
      const directionList = ["right", "left", "top", "bottom"];
      if (!directionList.includes(this.options.direction))
        this.options.direction = "top";
      const positionList = ["top-right", "top-left", "bottom-right", "bottom-left"];
      if (!positionList.includes(this.options.position))
        this.options.position = "bottom-right";
    };
    _setProperties = new WeakSet();
    setProperties_fn = function() {
      if (this.options.position.split("-")[0] === "top")
        this.el.style.top = this.options.offsetY;
      else
        this.el.style.bottom = this.options.offsetY;
      if (this.options.position.split("-")[1] === "right")
        this.el.style.right = this.options.offsetX;
      else
        this.el.style.left = this.options.offsetX;
      if (this.options.direction === "right" || this.options.direction === "left")
        this.el.classList.add("fab-dir-x");
      __privateMethod(this, _setMenuPosition, setMenuPosition_fn).call(this);
    };
    _setMenuPosition = new WeakSet();
    setMenuPosition_fn = function() {
      if (this.options.direction === "top" || this.options.direction === "bottom") {
        const height = __privateGet(this, _trigger2).clientHeight;
        if (this.options.direction === "top")
          __privateGet(this, _fabMenu).style.bottom = height + "px";
        else
          __privateGet(this, _fabMenu).style.top = height + "px";
      } else {
        const width = __privateGet(this, _trigger2).clientWidth;
        if (this.options.direction === "right")
          __privateGet(this, _fabMenu).style.left = width + "px";
        else
          __privateGet(this, _fabMenu).style.right = width + "px";
      }
    };
    _handleDocumentClick = new WeakSet();
    handleDocumentClick_fn = function(e) {
      const isInside = this.el.contains(e.target);
      if (!isInside && __privateGet(this, _isActive4))
        this.close();
    };
    _onClickTrigger4 = new WeakSet();
    onClickTrigger_fn4 = function(e) {
      e.preventDefault();
      if (__privateGet(this, _isAnimated5))
        return;
      if (__privateGet(this, _isActive4))
        this.close();
      else
        this.open();
    };
    __publicField(Fab, "getDefaultOptions", () => FabOptions);
    registerComponent({
      class: Fab,
      name: "Fab",
      dataDetection: true,
      autoInit: {
        enabled: true,
        selector: ".fab:not(i)"
      }
    });
    const LightboxOptions = {
      animationDuration: 400,
      overlayClass: "grey dark-4",
      offset: 150,
      mobileOffset: 80,
      caption: ""
    };
    class Lightbox extends AxentixComponent {
      constructor(element, options) {
        super();
        __privateAdd(this, _setOverlay);
        __privateAdd(this, _showOverlay);
        __privateAdd(this, _hideOverlay);
        __privateAdd(this, _unsetOverlay);
        __privateAdd(this, _calculateRatio);
        __privateAdd(this, _setOverflowParents);
        __privateAdd(this, _unsetOverflowParents);
        __privateAdd(this, _handleTransition);
        __privateAdd(this, _handleKeyUp);
        __privateAdd(this, _handleScroll);
        __privateAdd(this, _clearLightbox);
        __privateAdd(this, _onClickTrigger5);
        __publicField(this, "options");
        __privateAdd(this, _onClickRef, void 0);
        __privateAdd(this, _transitionEndEventRef, void 0);
        __privateAdd(this, _keyUpRef, void 0);
        __privateAdd(this, _scrollRef, void 0);
        __privateAdd(this, _resizeRef2, void 0);
        __privateAdd(this, _overlay, void 0);
        __privateAdd(this, _overlayClickEventRef, void 0);
        __privateAdd(this, _overflowParents, void 0);
        __privateAdd(this, _baseRect, void 0);
        __privateAdd(this, _newHeight, 0);
        __privateAdd(this, _newWidth, 0);
        __privateAdd(this, _isActive5, false);
        __privateAdd(this, _isResponsive, false);
        __privateAdd(this, _container, void 0);
        __privateAdd(this, _isClosing, false);
        __privateAdd(this, _isOpening, false);
        __privateAdd(this, _handleResize2, () => {
          if (__privateGet(this, _isActive5))
            this.close();
        });
        try {
          this.preventDbInstance(element);
          instances.push({ type: "Lightbox", instance: this });
          this.el = document.querySelector(element);
          this.options = getComponentOptions("Lightbox", options, this.el);
          this.setup();
        } catch (error) {
          console.error("[Axentix] Lightbox init error", error);
        }
      }
      setup() {
        createEvent(this.el, "lightbox.setup");
        this.el.style.transitionDuration = this.options.animationDuration + "ms";
        __privateSet(this, _container, wrap([this.el]));
        this.setupListeners();
      }
      setupListeners() {
        __privateSet(this, _onClickRef, __privateMethod(this, _onClickTrigger5, onClickTrigger_fn5).bind(this));
        this.el.addEventListener("click", __privateGet(this, _onClickRef));
        __privateSet(this, _keyUpRef, __privateMethod(this, _handleKeyUp, handleKeyUp_fn).bind(this));
        __privateSet(this, _scrollRef, __privateMethod(this, _handleScroll, handleScroll_fn).bind(this));
        __privateSet(this, _resizeRef2, __privateGet(this, _handleResize2).bind(this));
        __privateSet(this, _transitionEndEventRef, __privateMethod(this, _handleTransition, handleTransition_fn).bind(this));
        window.addEventListener("keyup", __privateGet(this, _keyUpRef));
        window.addEventListener("scroll", __privateGet(this, _scrollRef));
        window.addEventListener("resize", __privateGet(this, _resizeRef2));
        this.el.addEventListener("transitionend", __privateGet(this, _transitionEndEventRef));
      }
      removeListeners() {
        this.el.removeEventListener("click", __privateGet(this, _onClickRef));
        this.el.removeEventListener("transitionend", __privateGet(this, _transitionEndEventRef));
        window.removeEventListener("keyup", __privateGet(this, _keyUpRef));
        window.removeEventListener("scroll", __privateGet(this, _scrollRef));
        window.removeEventListener("resize", __privateGet(this, _resizeRef2));
        __privateSet(this, _onClickRef, void 0);
        __privateSet(this, _keyUpRef, void 0);
        __privateSet(this, _scrollRef, void 0);
        __privateSet(this, _resizeRef2, void 0);
        __privateSet(this, _transitionEndEventRef, void 0);
      }
      open() {
        __privateSet(this, _isOpening, true);
        let rect, containerRect;
        if (__privateGet(this, _isClosing)) {
          rect = containerRect = __privateGet(this, _container).getBoundingClientRect();
        } else {
          rect = containerRect = this.el.getBoundingClientRect();
        }
        __privateSet(this, _isClosing, false);
        __privateMethod(this, _setOverlay, setOverlay_fn).call(this);
        __privateMethod(this, _showOverlay, showOverlay_fn).call(this);
        const centerTop = window.innerHeight / 2;
        const centerLeft = window.innerWidth / 2;
        __privateSet(this, _baseRect, rect);
        this.el.style.width = __privateGet(this, _baseRect).width + "px";
        this.el.style.height = __privateGet(this, _baseRect).height + "px";
        this.el.style.top = "0";
        this.el.style.left = "0";
        const newTop = centerTop + window.scrollY - (containerRect.top + window.scrollY);
        const newLeft = centerLeft + window.scrollX - (containerRect.left + window.scrollX);
        __privateMethod(this, _calculateRatio, calculateRatio_fn).call(this);
        __privateGet(this, _container).style.position = "relative";
        setTimeout(() => {
          createEvent(this.el, "lightbox.open");
          __privateSet(this, _isActive5, true);
          if (this.el.classList.contains("responsive-media")) {
            __privateSet(this, _isResponsive, true);
            this.el.classList.remove("responsive-media");
          }
          this.el.classList.add("active");
          __privateGet(this, _container).style.width = __privateGet(this, _baseRect).width + "px";
          __privateGet(this, _container).style.height = __privateGet(this, _baseRect).height + "px";
          this.el.style.width = __privateGet(this, _newWidth) + "px";
          this.el.style.height = __privateGet(this, _newHeight) + "px";
          this.el.style.top = newTop - __privateGet(this, _newHeight) / 2 + "px";
          this.el.style.left = newLeft - __privateGet(this, _newWidth) / 2 + "px";
        }, 50);
      }
      close(e) {
        if ((e == null ? void 0 : e.key) && e.key !== "Escape")
          return;
        __privateSet(this, _isActive5, false);
        __privateSet(this, _isClosing, true);
        __privateSet(this, _isOpening, false);
        createEvent(this.el, "lightbox.close");
        __privateMethod(this, _hideOverlay, hideOverlay_fn).call(this);
        this.el.style.position = "absolute";
        this.el.style.top = "0px";
        this.el.style.left = "0px";
        this.el.style.width = __privateGet(this, _baseRect).width + "px";
        this.el.style.height = __privateGet(this, _baseRect).height + "px";
      }
    }
    _onClickRef = new WeakMap();
    _transitionEndEventRef = new WeakMap();
    _keyUpRef = new WeakMap();
    _scrollRef = new WeakMap();
    _resizeRef2 = new WeakMap();
    _overlay = new WeakMap();
    _overlayClickEventRef = new WeakMap();
    _overflowParents = new WeakMap();
    _baseRect = new WeakMap();
    _newHeight = new WeakMap();
    _newWidth = new WeakMap();
    _isActive5 = new WeakMap();
    _isResponsive = new WeakMap();
    _container = new WeakMap();
    _isClosing = new WeakMap();
    _isOpening = new WeakMap();
    _setOverlay = new WeakSet();
    setOverlay_fn = function() {
      if (__privateGet(this, _overlay)) {
        return;
      }
      __privateMethod(this, _setOverflowParents, setOverflowParents_fn).call(this);
      __privateSet(this, _overlay, document.createElement("div"));
      __privateGet(this, _overlay).style.transitionDuration = this.options.animationDuration + "ms";
      __privateGet(this, _overlay).className = "lightbox-overlay " + this.options.overlayClass;
      __privateGet(this, _container).appendChild(__privateGet(this, _overlay));
      if (this.options.caption) {
        const caption = document.createElement("p");
        caption.className = "lightbox-caption";
        caption.innerHTML = this.options.caption;
        __privateGet(this, _overlay).appendChild(caption);
      }
      __privateSet(this, _overlayClickEventRef, this.close.bind(this));
      __privateGet(this, _overlay).addEventListener("click", __privateGet(this, _overlayClickEventRef));
    };
    _showOverlay = new WeakSet();
    showOverlay_fn = function() {
      setTimeout(() => {
        __privateGet(this, _overlay).style.opacity = "1";
      }, 50);
    };
    _hideOverlay = new WeakSet();
    hideOverlay_fn = function() {
      __privateGet(this, _overlay).style.opacity = "0";
    };
    _unsetOverlay = new WeakSet();
    unsetOverlay_fn = function() {
      __privateGet(this, _overlay).removeEventListener("click", __privateGet(this, _overlayClickEventRef));
      __privateGet(this, _overlay).remove();
      __privateSet(this, _overlay, null);
    };
    _calculateRatio = new WeakSet();
    calculateRatio_fn = function() {
      const offset = window.innerWidth >= 960 ? this.options.offset : this.options.mobileOffset;
      if (window.innerWidth / window.innerHeight >= __privateGet(this, _baseRect).width / __privateGet(this, _baseRect).height) {
        __privateSet(this, _newHeight, window.innerHeight - offset);
        __privateSet(this, _newWidth, __privateGet(this, _newHeight) * __privateGet(this, _baseRect).width / __privateGet(this, _baseRect).height);
      } else {
        __privateSet(this, _newWidth, window.innerWidth - offset);
        __privateSet(this, _newHeight, __privateGet(this, _newWidth) * __privateGet(this, _baseRect).height / __privateGet(this, _baseRect).width);
      }
    };
    _setOverflowParents = new WeakSet();
    setOverflowParents_fn = function() {
      __privateSet(this, _overflowParents, []);
      for (let elem = this.el; elem && elem !== document; elem = elem.parentNode) {
        const elementSyle = window.getComputedStyle(elem);
        if (elementSyle.overflow === "hidden" || elementSyle.overflowX === "hidden" || elementSyle.overflowY === "hidden") {
          __privateGet(this, _overflowParents).push(elem);
          if (elem !== document.body)
            elem.style.setProperty("overflow", "visible", "important");
          document.body.style.overflowX = "hidden";
        }
      }
    };
    _unsetOverflowParents = new WeakSet();
    unsetOverflowParents_fn = function() {
      __privateGet(this, _overflowParents).forEach((parent) => parent.style.overflow = "");
      document.body.style.overflowX = "";
    };
    _handleTransition = new WeakSet();
    handleTransition_fn = function(e) {
      if (!e.propertyName.includes("width") && !e.propertyName.includes("height")) {
        return;
      }
      if (__privateGet(this, _isClosing)) {
        __privateMethod(this, _clearLightbox, clearLightbox_fn).call(this);
        __privateSet(this, _isClosing, false);
        __privateSet(this, _isActive5, false);
        createEvent(this.el, "lightbox.closed");
      } else if (__privateGet(this, _isOpening)) {
        __privateSet(this, _isOpening, false);
        createEvent(this.el, "lightbox.opened");
      }
    };
    _handleKeyUp = new WeakSet();
    handleKeyUp_fn = function(e) {
      if (e.key === "Escape" && (__privateGet(this, _isOpening) || __privateGet(this, _isActive5)))
        this.close();
    };
    _handleScroll = new WeakSet();
    handleScroll_fn = function() {
      if (__privateGet(this, _isActive5) || __privateGet(this, _isOpening))
        this.close();
    };
    _handleResize2 = new WeakMap();
    _clearLightbox = new WeakSet();
    clearLightbox_fn = function() {
      this.el.classList.remove("active");
      __privateMethod(this, _unsetOverlay, unsetOverlay_fn).call(this);
      __privateMethod(this, _unsetOverflowParents, unsetOverflowParents_fn).call(this);
      if (__privateGet(this, _isResponsive))
        this.el.classList.add("responsive-media");
      __privateGet(this, _container).removeAttribute("style");
      this.el.style.position = "";
      this.el.style.left = "";
      this.el.style.top = "";
      this.el.style.width = "";
      this.el.style.height = "";
      this.el.style.transform = "";
    };
    _onClickTrigger5 = new WeakSet();
    onClickTrigger_fn5 = function() {
      if (__privateGet(this, _isOpening) || __privateGet(this, _isActive5)) {
        this.close();
        return;
      }
      this.open();
    };
    __publicField(Lightbox, "getDefaultOptions", () => LightboxOptions);
    registerComponent({
      class: Lightbox,
      name: "Lightbox",
      dataDetection: true,
      autoInit: {
        enabled: true,
        selector: ".lightbox"
      }
    });
    const ModalOptions = {
      overlay: true,
      bodyScrolling: false,
      animationDuration: 400
    };
    class Modal extends AxentixComponent {
      constructor(element, options) {
        super();
        __privateAdd(this, _toggleBodyScroll2);
        __privateAdd(this, _setZIndex);
        __privateAdd(this, _onClickTrigger6);
        __publicField(this, "options");
        __publicField(this, "overlayElement");
        __privateAdd(this, _triggers3, void 0);
        __privateAdd(this, _isActive6, false);
        __privateAdd(this, _isAnimated6, false);
        __privateAdd(this, _listenerRef5, void 0);
        try {
          this.preventDbInstance(element);
          instances.push({ type: "Modal", instance: this });
          this.el = document.querySelector(element);
          this.options = getComponentOptions("Modal", options, this.el);
          this.setup();
        } catch (error) {
          console.error("[Axentix] Modal init error", error);
        }
      }
      setup() {
        createEvent(this.el, "modal.setup");
        __privateSet(this, _triggers3, getTriggers(this.el.id));
        __privateSet(this, _isActive6, this.el.classList.contains("active") ? true : false);
        __privateSet(this, _isAnimated6, false);
        this.setupListeners();
        if (this.options.overlay)
          this.overlayElement = createOverlay(__privateGet(this, _isActive6), this.options.overlay, this.el.id, this.options.animationDuration);
        this.el.style.transitionDuration = this.options.animationDuration + "ms";
        this.el.style.animationDuration = this.options.animationDuration + "ms";
      }
      setupListeners() {
        __privateSet(this, _listenerRef5, __privateMethod(this, _onClickTrigger6, onClickTrigger_fn6).bind(this));
        __privateGet(this, _triggers3).forEach((trigger) => trigger.addEventListener("click", __privateGet(this, _listenerRef5)));
      }
      removeListeners() {
        __privateGet(this, _triggers3).forEach((trigger) => trigger.removeEventListener("click", __privateGet(this, _listenerRef5)));
        __privateSet(this, _listenerRef5, void 0);
      }
      open() {
        if (__privateGet(this, _isActive6))
          return;
        createEvent(this.el, "modal.open");
        __privateSet(this, _isActive6, true);
        __privateSet(this, _isAnimated6, true);
        __privateMethod(this, _setZIndex, setZIndex_fn).call(this);
        this.el.style.display = "block";
        updateOverlay(this.options.overlay, this.overlayElement, __privateGet(this, _listenerRef5), true, this.options.animationDuration);
        __privateMethod(this, _toggleBodyScroll2, toggleBodyScroll_fn2).call(this, false);
        setTimeout(() => {
          this.el.classList.add("active");
        }, 50);
        setTimeout(() => {
          __privateSet(this, _isAnimated6, false);
          createEvent(this.el, "modal.opened");
        }, this.options.animationDuration);
      }
      close() {
        if (!__privateGet(this, _isActive6))
          return;
        createEvent(this.el, "modal.close");
        __privateSet(this, _isAnimated6, true);
        this.el.classList.remove("active");
        updateOverlay(this.options.overlay, this.overlayElement, __privateGet(this, _listenerRef5), false, this.options.animationDuration);
        setTimeout(() => {
          this.el.style.display = "";
          __privateSet(this, _isAnimated6, false);
          __privateSet(this, _isActive6, false);
          __privateMethod(this, _toggleBodyScroll2, toggleBodyScroll_fn2).call(this, true);
          createEvent(this.el, "modal.closed");
        }, this.options.animationDuration);
      }
    }
    _triggers3 = new WeakMap();
    _isActive6 = new WeakMap();
    _isAnimated6 = new WeakMap();
    _listenerRef5 = new WeakMap();
    _toggleBodyScroll2 = new WeakSet();
    toggleBodyScroll_fn2 = function(state) {
      if (!this.options.bodyScrolling)
        document.body.style.overflow = state ? "" : "hidden";
    };
    _setZIndex = new WeakSet();
    setZIndex_fn = function() {
      const totalModals = document.querySelectorAll(".modal.active").length + 1;
      if (this.options.overlay)
        this.overlayElement.style.zIndex = String(800 + totalModals * 10 - 2);
      this.el.style.zIndex = String(800 + totalModals * 10);
    };
    _onClickTrigger6 = new WeakSet();
    onClickTrigger_fn6 = function(e) {
      e.preventDefault();
      if (__privateGet(this, _isAnimated6))
        return;
      if (__privateGet(this, _isActive6))
        this.close();
      else
        this.open();
    };
    __publicField(Modal, "getDefaultOptions", () => ModalOptions);
    registerComponent({
      class: Modal,
      name: "Modal",
      dataDetection: true,
      autoInit: {
        enabled: true,
        selector: ".modal"
      }
    });
    const TabOptions = {
      animationDuration: 300,
      animationType: "none",
      disableActiveBar: false,
      caroulix: {
        animationDuration: 300,
        backToOpposite: false,
        enableTouch: false,
        autoplay: {
          enabled: false
        }
      }
    };
    class Tab extends AxentixComponent {
      constructor(element, options) {
        super();
        __privateAdd(this, _handleResizeEvent);
        __privateAdd(this, _handleCaroulixSlide);
        __privateAdd(this, _getItems);
        __privateAdd(this, _hideContent);
        __privateAdd(this, _enableSlideAnimation);
        __privateAdd(this, _setActiveElement);
        __privateAdd(this, _toggleArrowMode);
        __privateAdd(this, _scrollLeft);
        __privateAdd(this, _scrollRight);
        __privateAdd(this, _onClickItem);
        __privateAdd(this, _getPreviousItemIndex);
        __privateAdd(this, _getNextItemIndex);
        __publicField(this, "options");
        __privateAdd(this, _tabArrow, void 0);
        __privateAdd(this, _tabLinks, void 0);
        __privateAdd(this, _tabMenu, void 0);
        __privateAdd(this, _currentItemIndex, 0);
        __privateAdd(this, _leftArrow, void 0);
        __privateAdd(this, _rightArrow, void 0);
        __privateAdd(this, _scrollLeftRef, void 0);
        __privateAdd(this, _scrollRightRef, void 0);
        __privateAdd(this, _arrowRef, void 0);
        __privateAdd(this, _caroulixSlideRef, void 0);
        __privateAdd(this, _resizeTabRef, void 0);
        __privateAdd(this, _tabItems, void 0);
        __privateAdd(this, _tabCaroulix, void 0);
        __privateAdd(this, _tabCaroulixInit, false);
        __privateAdd(this, _caroulixInstance, void 0);
        __privateAdd(this, _isAnimated7, false);
        try {
          this.preventDbInstance(element);
          instances.push({ type: "Tab", instance: this });
          this.el = document.querySelector(element);
          this.options = getComponentOptions("Tab", options, this.el);
          this.setup();
        } catch (error) {
          console.error("[Axentix] Tab init error", error);
        }
      }
      setup() {
        createEvent(this.el, "tab.setup");
        const animationList = ["none", "slide"];
        if (!animationList.includes(this.options.animationType))
          this.options.animationType = "none";
        __privateSet(this, _isAnimated7, false);
        __privateSet(this, _tabArrow, this.el.querySelector(".tab-arrow"));
        __privateSet(this, _tabLinks, this.el.querySelectorAll(".tab-menu .tab-link"));
        __privateSet(this, _tabMenu, this.el.querySelector(".tab-menu"));
        __privateSet(this, _currentItemIndex, 0);
        __privateSet(this, _tabItems, __privateMethod(this, _getItems, getItems_fn).call(this));
        if (__privateGet(this, _tabArrow)) {
          __privateMethod(this, _toggleArrowMode, toggleArrowMode_fn).call(this);
          __privateSet(this, _leftArrow, this.el.querySelector(".tab-arrow .tab-prev"));
          __privateSet(this, _rightArrow, this.el.querySelector(".tab-arrow .tab-next"));
        }
        this.setupListeners();
        __privateGet(this, _tabMenu).style.transitionDuration = this.options.animationDuration + "ms";
        if (this.options.animationType === "slide")
          __privateMethod(this, _enableSlideAnimation, enableSlideAnimation_fn).call(this);
        else
          this.updateActiveElement();
      }
      setupListeners() {
        __privateGet(this, _tabLinks).forEach((item) => {
          item.listenerRef = __privateMethod(this, _onClickItem, onClickItem_fn).bind(this, item);
          item.addEventListener("click", item.listenerRef);
        });
        __privateSet(this, _resizeTabRef, __privateMethod(this, _handleResizeEvent, handleResizeEvent_fn).bind(this));
        window.addEventListener("resize", __privateGet(this, _resizeTabRef));
        if (__privateGet(this, _tabArrow)) {
          __privateSet(this, _arrowRef, __privateMethod(this, _toggleArrowMode, toggleArrowMode_fn).bind(this));
          window.addEventListener("resize", __privateGet(this, _arrowRef));
          __privateSet(this, _scrollLeftRef, __privateMethod(this, _scrollLeft, scrollLeft_fn).bind(this));
          __privateSet(this, _scrollRightRef, __privateMethod(this, _scrollRight, scrollRight_fn).bind(this));
          __privateGet(this, _leftArrow).addEventListener("click", __privateGet(this, _scrollLeftRef));
          __privateGet(this, _rightArrow).addEventListener("click", __privateGet(this, _scrollRightRef));
        }
      }
      removeListeners() {
        __privateGet(this, _tabLinks).forEach((item) => {
          item.removeEventListener("click", item.listenerRef);
          item.listenerRef = void 0;
        });
        window.removeEventListener("resize", __privateGet(this, _resizeTabRef));
        __privateSet(this, _resizeTabRef, void 0);
        if (__privateGet(this, _tabArrow)) {
          window.removeEventListener("resize", __privateGet(this, _arrowRef));
          __privateSet(this, _arrowRef, void 0);
          __privateGet(this, _leftArrow).removeEventListener("click", __privateGet(this, _scrollLeftRef));
          __privateGet(this, _rightArrow).removeEventListener("click", __privateGet(this, _scrollRightRef));
          __privateSet(this, _scrollLeftRef, void 0);
          __privateSet(this, _scrollRightRef, void 0);
        }
        if (__privateGet(this, _caroulixSlideRef)) {
          this.el.removeEventListener("ax.caroulix.slide", __privateGet(this, _caroulixSlideRef));
          __privateSet(this, _caroulixSlideRef, void 0);
        }
      }
      select(itemId) {
        if (__privateGet(this, _isAnimated7))
          return;
        __privateSet(this, _isAnimated7, true);
        const menuItem = this.el.querySelector('.tab-menu a[href="#' + itemId + '"]');
        __privateSet(this, _currentItemIndex, Array.from(__privateGet(this, _tabLinks)).findIndex((item) => item.children[0] === menuItem));
        createEvent(menuItem, "tab.select", { currentIndex: __privateGet(this, _currentItemIndex) });
        __privateMethod(this, _setActiveElement, setActiveElement_fn).call(this, menuItem.parentElement);
        if (__privateGet(this, _tabCaroulixInit)) {
          __privateGet(this, _tabItems).forEach((item) => item.id === itemId ? item.classList.add("active") : "");
          const caroulixClass = getComponentClass("Caroulix");
          __privateSet(this, _caroulixInstance, new caroulixClass("#" + __privateGet(this, _tabCaroulix).id, this.options.caroulix, this.el, true));
          __privateSet(this, _caroulixSlideRef, __privateMethod(this, _handleCaroulixSlide, handleCaroulixSlide_fn).bind(this));
          this.el.addEventListener("ax.caroulix.slide", __privateGet(this, _caroulixSlideRef));
          __privateSet(this, _tabCaroulixInit, false);
          __privateSet(this, _isAnimated7, false);
          return;
        }
        if (this.options.animationType === "slide") {
          const nb = __privateGet(this, _tabItems).findIndex((item) => item.id === itemId);
          __privateGet(this, _caroulixInstance).goTo(nb);
          setTimeout(() => {
            __privateSet(this, _isAnimated7, false);
          }, this.options.animationDuration);
        } else {
          __privateMethod(this, _hideContent, hideContent_fn).call(this);
          __privateGet(this, _tabItems).forEach((item) => {
            if (item.id === itemId)
              item.style.display = "block";
          });
          __privateSet(this, _isAnimated7, false);
        }
      }
      updateActiveElement() {
        let itemSelected;
        __privateGet(this, _tabLinks).forEach((item, index) => {
          if (item.classList.contains("active")) {
            itemSelected = item;
            __privateSet(this, _currentItemIndex, index);
          }
        });
        if (!itemSelected) {
          itemSelected = __privateGet(this, _tabLinks).item(0);
          __privateSet(this, _currentItemIndex, 0);
        }
        const target = itemSelected.children[0].getAttribute("href");
        this.select(target.split("#")[1]);
      }
      prev(step = 1) {
        if (__privateGet(this, _isAnimated7))
          return;
        const previousItemIndex = __privateMethod(this, _getPreviousItemIndex, getPreviousItemIndex_fn).call(this, step);
        __privateSet(this, _currentItemIndex, previousItemIndex);
        createEvent(this.el, "tab.prev", { step });
        const target = __privateGet(this, _tabLinks)[previousItemIndex].children[0].getAttribute("href");
        this.select(target.split("#")[1]);
      }
      next(step = 1) {
        if (__privateGet(this, _isAnimated7))
          return;
        const nextItemIndex = __privateMethod(this, _getNextItemIndex, getNextItemIndex_fn).call(this, step);
        __privateSet(this, _currentItemIndex, nextItemIndex);
        createEvent(this.el, "tab.next", { step });
        const target = __privateGet(this, _tabLinks)[nextItemIndex].children[0].getAttribute("href");
        this.select(target.split("#")[1]);
      }
    }
    _tabArrow = new WeakMap();
    _tabLinks = new WeakMap();
    _tabMenu = new WeakMap();
    _currentItemIndex = new WeakMap();
    _leftArrow = new WeakMap();
    _rightArrow = new WeakMap();
    _scrollLeftRef = new WeakMap();
    _scrollRightRef = new WeakMap();
    _arrowRef = new WeakMap();
    _caroulixSlideRef = new WeakMap();
    _resizeTabRef = new WeakMap();
    _tabItems = new WeakMap();
    _tabCaroulix = new WeakMap();
    _tabCaroulixInit = new WeakMap();
    _caroulixInstance = new WeakMap();
    _isAnimated7 = new WeakMap();
    _handleResizeEvent = new WeakSet();
    handleResizeEvent_fn = function() {
      this.updateActiveElement();
      for (let i = 100; i < 500; i += 100) {
        setTimeout(() => {
          this.updateActiveElement();
        }, i);
      }
    };
    _handleCaroulixSlide = new WeakSet();
    handleCaroulixSlide_fn = function() {
      if (__privateGet(this, _currentItemIndex) !== __privateGet(this, _caroulixInstance).activeIndex) {
        __privateSet(this, _currentItemIndex, __privateGet(this, _caroulixInstance).activeIndex);
        __privateMethod(this, _setActiveElement, setActiveElement_fn).call(this, __privateGet(this, _tabLinks)[__privateGet(this, _currentItemIndex)]);
      }
    };
    _getItems = new WeakSet();
    getItems_fn = function() {
      return Array.from(__privateGet(this, _tabLinks)).map((link) => {
        const id = link.children[0].getAttribute("href");
        return this.el.querySelector(id);
      });
    };
    _hideContent = new WeakSet();
    hideContent_fn = function() {
      __privateGet(this, _tabItems).forEach((item) => item.style.display = "none");
    };
    _enableSlideAnimation = new WeakSet();
    enableSlideAnimation_fn = function() {
      __privateGet(this, _tabItems).forEach((item) => item.classList.add("caroulix-item"));
      __privateSet(this, _tabCaroulix, wrap(__privateGet(this, _tabItems)));
      __privateGet(this, _tabCaroulix).classList.add("caroulix");
      const nb = Math.random().toString().split(".")[1];
      __privateGet(this, _tabCaroulix).id = "tab-caroulix-" + nb;
      __privateSet(this, _tabCaroulixInit, true);
      if (this.options.animationDuration !== 300)
        this.options.caroulix.animationDuration = this.options.animationDuration;
      this.updateActiveElement();
    };
    _setActiveElement = new WeakSet();
    setActiveElement_fn = function(element) {
      __privateGet(this, _tabLinks).forEach((item) => item.classList.remove("active"));
      if (!this.options.disableActiveBar) {
        const elementRect = element.getBoundingClientRect();
        const elementPosLeft = elementRect.left;
        const menuPosLeft = __privateGet(this, _tabMenu).getBoundingClientRect().left;
        const left = elementPosLeft - menuPosLeft + __privateGet(this, _tabMenu).scrollLeft;
        const elementWidth = elementRect.width;
        const right = __privateGet(this, _tabMenu).clientWidth - left - elementWidth;
        __privateGet(this, _tabMenu).style.setProperty(getCssVar("tab-bar-left-offset"), Math.floor(left) + "px");
        __privateGet(this, _tabMenu).style.setProperty(getCssVar("tab-bar-right-offset"), Math.ceil(right) + "px");
      }
      element.classList.add("active");
    };
    _toggleArrowMode = new WeakSet();
    toggleArrowMode_fn = function() {
      const totalWidth = Array.from(__privateGet(this, _tabLinks)).reduce((acc, element) => {
        acc += element.clientWidth;
        return acc;
      }, 0);
      const arrowWidth = __privateGet(this, _tabArrow).clientWidth;
      if (totalWidth > arrowWidth) {
        if (!__privateGet(this, _tabArrow).classList.contains("tab-arrow-show"))
          __privateGet(this, _tabArrow).classList.add("tab-arrow-show");
      } else {
        if (__privateGet(this, _tabArrow).classList.contains("tab-arrow-show"))
          __privateGet(this, _tabArrow).classList.remove("tab-arrow-show");
      }
    };
    _scrollLeft = new WeakSet();
    scrollLeft_fn = function(e) {
      e.preventDefault();
      __privateGet(this, _tabMenu).scrollLeft -= 40;
    };
    _scrollRight = new WeakSet();
    scrollRight_fn = function(e) {
      e.preventDefault();
      __privateGet(this, _tabMenu).scrollLeft += 40;
    };
    _onClickItem = new WeakSet();
    onClickItem_fn = function(item, e) {
      e.preventDefault();
      if (__privateGet(this, _isAnimated7) || item.classList.contains("active"))
        return;
      const target = item.children[0].getAttribute("href");
      this.select(target.split("#")[1]);
    };
    _getPreviousItemIndex = new WeakSet();
    getPreviousItemIndex_fn = function(step) {
      let previousItemIndex = 0;
      let index = __privateGet(this, _currentItemIndex);
      for (let i = 0; i < step; i++) {
        if (index > 0) {
          previousItemIndex = index - 1;
          index--;
        } else {
          index = __privateGet(this, _tabLinks).length - 1;
          previousItemIndex = index;
        }
      }
      return previousItemIndex;
    };
    _getNextItemIndex = new WeakSet();
    getNextItemIndex_fn = function(step) {
      let nextItemIndex = 0;
      let index = __privateGet(this, _currentItemIndex);
      for (let i = 0; i < step; i++) {
        if (index < __privateGet(this, _tabLinks).length - 1) {
          nextItemIndex = index + 1;
          index++;
        } else {
          index = 0;
          nextItemIndex = index;
        }
      }
      return nextItemIndex;
    };
    __publicField(Tab, "getDefaultOptions", () => TabOptions);
    registerComponent({
      class: Tab,
      name: "Tab",
      dataDetection: true,
      autoInit: {
        enabled: true,
        selector: ".tab"
      }
    });
    const ScrollSpyOptions = {
      offset: 200,
      linkSelector: "a",
      classes: "active",
      auto: {
        enabled: false,
        classes: "",
        selector: ""
      }
    };
    class ScrollSpy extends AxentixComponent {
      constructor(element, options) {
        super();
        __privateAdd(this, _setupBasic);
        __privateAdd(this, _setupAuto);
        __privateAdd(this, _getElement);
        __privateAdd(this, _removeOldLink);
        __privateAdd(this, _getClosestElem);
        __privateAdd(this, _update);
        __publicField(this, "options");
        __privateAdd(this, _oldLink, void 0);
        __privateAdd(this, _updateRef, void 0);
        __privateAdd(this, _links, void 0);
        __privateAdd(this, _elements, void 0);
        try {
          this.preventDbInstance(element);
          instances.push({ type: "ScrollSpy", instance: this });
          this.el = document.querySelector(element);
          this.options = getComponentOptions("ScrollSpy", options, this.el);
          this.setup();
        } catch (error) {
          console.error("[Axentix] ScrollSpy init error", error);
        }
      }
      setup() {
        createEvent(this.el, "scrollspy.setup");
        if (this.options.auto.enabled)
          __privateMethod(this, _setupAuto, setupAuto_fn).call(this);
        else
          __privateMethod(this, _setupBasic, setupBasic_fn).call(this);
        if (typeof this.options.classes === "string")
          this.options.classes = this.options.classes.split(" ");
        __privateSet(this, _oldLink, "");
        this.setupListeners();
        __privateMethod(this, _update, update_fn).call(this);
      }
      setupListeners() {
        __privateSet(this, _updateRef, __privateMethod(this, _update, update_fn).bind(this));
        window.addEventListener("scroll", __privateGet(this, _updateRef));
        window.addEventListener("resize", __privateGet(this, _updateRef));
      }
      removeListeners() {
        window.removeEventListener("scroll", __privateGet(this, _updateRef));
        window.removeEventListener("resize", __privateGet(this, _updateRef));
        __privateSet(this, _updateRef, void 0);
      }
    }
    _oldLink = new WeakMap();
    _updateRef = new WeakMap();
    _links = new WeakMap();
    _elements = new WeakMap();
    _setupBasic = new WeakSet();
    setupBasic_fn = function() {
      __privateSet(this, _links, Array.from(this.el.querySelectorAll(this.options.linkSelector)));
      __privateSet(this, _elements, __privateGet(this, _links).map((link) => document.querySelector(link.getAttribute("href"))));
    };
    _setupAuto = new WeakSet();
    setupAuto_fn = function() {
      __privateSet(this, _elements, Array.from(document.querySelectorAll(this.options.auto.selector)));
      __privateSet(this, _links, __privateGet(this, _elements).map((el) => {
        const link = document.createElement("a");
        link.className = this.options.auto.classes;
        link.setAttribute("href", "#" + el.id);
        link.innerHTML = el.innerHTML;
        this.el.appendChild(link);
        return link;
      }));
    };
    _getElement = new WeakSet();
    getElement_fn = function() {
      const top = window.scrollY, left = window.scrollX, right = window.innerWidth, bottom = window.innerHeight, topBreakpoint = top + this.options.offset;
      if (bottom + top >= document.body.offsetHeight - 2)
        return __privateGet(this, _elements)[__privateGet(this, _elements).length - 1];
      return __privateGet(this, _elements).find((el) => {
        const elRect = el.getBoundingClientRect();
        return elRect.top + top >= top && elRect.left + left >= left && elRect.right <= right && elRect.bottom <= bottom && elRect.top + top <= topBreakpoint;
      });
    };
    _removeOldLink = new WeakSet();
    removeOldLink_fn = function() {
      if (!__privateGet(this, _oldLink))
        return;
      this.options.classes.forEach((cl) => __privateGet(this, _oldLink).classList.remove(cl));
    };
    _getClosestElem = new WeakSet();
    getClosestElem_fn = function() {
      const top = window.scrollY;
      return __privateGet(this, _elements).reduce((prev, curr) => {
        const currTop = curr.getBoundingClientRect().top + top;
        const prevTop = prev.getBoundingClientRect().top + top;
        if (currTop > top + this.options.offset)
          return prev;
        else if (Math.abs(currTop - top) < Math.abs(prevTop - top))
          return curr;
        return prev;
      });
    };
    _update = new WeakSet();
    update_fn = function() {
      let element = __privateMethod(this, _getElement, getElement_fn).call(this);
      if (!element)
        element = __privateMethod(this, _getClosestElem, getClosestElem_fn).call(this);
      const link = __privateGet(this, _links).find((l) => l.getAttribute("href").split("#")[1] === element.id);
      if (link === __privateGet(this, _oldLink))
        return;
      createEvent(this.el, "scrollspy.update");
      __privateMethod(this, _removeOldLink, removeOldLink_fn).call(this);
      this.options.classes.forEach((cl) => link.classList.add(cl));
      __privateSet(this, _oldLink, link);
    };
    __publicField(ScrollSpy, "getDefaultOptions", () => ScrollSpyOptions);
    registerComponent({
      class: ScrollSpy,
      name: "ScrollSpy",
      dataDetection: true,
      autoInit: {
        enabled: true,
        selector: ".scrollspy"
      }
    });
    const ToastOptions = {
      animationDuration: 400,
      duration: 4e3,
      classes: "",
      position: "right",
      direction: "top",
      mobileDirection: "bottom",
      offset: { x: "5%", y: "0%", mobileX: "10%", mobileY: "0%" },
      isClosable: false,
      isSwipeable: true,
      closableContent: "x",
      loading: {
        enabled: true,
        border: "2px solid #E2E2E2"
      }
    };
    const _Toast = class {
      constructor(content, options) {
        __privateAdd(this, _createToaster);
        __privateAdd(this, _removeToaster);
        __privateAdd(this, _fadeInToast);
        __privateAdd(this, _fadeOutToast);
        __privateAdd(this, _animOut);
        __privateAdd(this, _setupSwipeListeners);
        __privateAdd(this, _handleDragStart2);
        __privateAdd(this, _handleDragMove2);
        __privateAdd(this, _handleDragRelease2);
        __privateAdd(this, _handleSwipe);
        __privateAdd(this, _createToast);
        __privateAdd(this, _hide);
        __publicField(this, "options");
        __publicField(this, "id");
        __privateAdd(this, _content, void 0);
        __privateAdd(this, _toasters, void 0);
        __privateAdd(this, _pointerType2, void 0);
        __privateAdd(this, _touchStartRef2, void 0);
        __privateAdd(this, _touchMoveRef2, void 0);
        __privateAdd(this, _touchReleaseRef2, void 0);
        __privateAdd(this, _isPressed2, void 0);
        __privateAdd(this, _xStart2, void 0);
        if (getInstanceByType("Toast").length > 0) {
          console.error("[Axentix] Toast: Don't try to create multiple toast instances");
          return;
        }
        instances.push({ type: "Toast", instance: this });
        this.id = Math.random().toString().split(".")[1];
        __privateSet(this, _content, content);
        this.options = extend(_Toast.getDefaultOptions(), options);
        __privateSet(this, _pointerType2, getPointerType());
        this.options.position = this.options.position.toLowerCase();
        this.options.direction = this.options.direction.toLowerCase();
        this.options.mobileDirection = this.options.mobileDirection.toLowerCase();
        __privateSet(this, _toasters, {});
      }
      destroy() {
        const index = instances.findIndex((ins) => ins.instance.id === this.id);
        instances.splice(index, 1);
      }
      show() {
        try {
          if (!Object.keys(__privateGet(this, _toasters)).includes(this.options.position))
            __privateMethod(this, _createToaster, createToaster_fn).call(this);
          __privateMethod(this, _createToast, createToast_fn).call(this);
        } catch (error) {
          console.error("[Axentix] Toast error", error);
        }
      }
      change(content, options) {
        __privateSet(this, _content, content);
        this.options = extend(this.options, options);
      }
    };
    let Toast = _Toast;
    _content = new WeakMap();
    _toasters = new WeakMap();
    _pointerType2 = new WeakMap();
    _touchStartRef2 = new WeakMap();
    _touchMoveRef2 = new WeakMap();
    _touchReleaseRef2 = new WeakMap();
    _isPressed2 = new WeakMap();
    _xStart2 = new WeakMap();
    _createToaster = new WeakSet();
    createToaster_fn = function() {
      let toaster = document.createElement("div");
      const positionList = ["right", "left"];
      if (!positionList.includes(this.options.position))
        this.options.position = "right";
      if (this.options.position === "right")
        toaster.style.right = this.options.offset.x;
      else
        toaster.style.left = this.options.offset.x;
      const directionList = ["bottom", "top"];
      if (!directionList.includes(this.options.direction))
        this.options.direction = "top";
      if (this.options.direction === "top")
        toaster.style.top = this.options.offset.y;
      else
        toaster.style.bottom = this.options.offset.y;
      if (!directionList.includes(this.options.mobileDirection))
        this.options.mobileDirection = "bottom";
      toaster.style.setProperty(getCssVar("toaster-m-width"), 100 - this.options.offset.mobileX.slice(0, -1) + "%");
      toaster.style.setProperty(getCssVar("toaster-m-offset"), this.options.offset.mobileY);
      if (this.options.loading.enabled)
        toaster.style.setProperty(getCssVar("toast-loading-border"), this.options.loading.border);
      toaster.className = `toaster toaster-${this.options.position} toast-${this.options.direction} toaster-m-${this.options.mobileDirection}`;
      __privateGet(this, _toasters)[this.options.position] = toaster;
      document.body.appendChild(toaster);
    };
    _removeToaster = new WeakSet();
    removeToaster_fn = function() {
      for (const key in __privateGet(this, _toasters)) {
        let toaster = __privateGet(this, _toasters)[key];
        if (toaster.childElementCount <= 0) {
          toaster.remove();
          delete __privateGet(this, _toasters)[key];
        }
      }
    };
    _fadeInToast = new WeakSet();
    fadeInToast_fn = function(toast2) {
      setTimeout(() => {
        createEvent(toast2, "toast.show");
        if (this.options.loading.enabled) {
          toast2.classList.add("toast-loading");
          toast2.style.setProperty(getCssVar("toast-loading-duration"), this.options.duration + "ms");
        }
        toast2.classList.add("toast-animated");
        setTimeout(() => {
          createEvent(toast2, "toast.shown");
          if (this.options.loading.enabled)
            toast2.classList.add("toast-load");
        }, this.options.animationDuration);
      }, 50);
    };
    _fadeOutToast = new WeakSet();
    fadeOutToast_fn = function(toast2) {
      setTimeout(() => {
        createEvent(toast2, "toast.hide");
        __privateMethod(this, _hide, hide_fn).call(this, toast2);
      }, this.options.duration + this.options.animationDuration);
    };
    _animOut = new WeakSet();
    animOut_fn = function(toast2) {
      toast2.style.transitionTimingFunction = "cubic-bezier(0.445, 0.05, 0.55, 0.95)";
      toast2.style.paddingTop = "0";
      toast2.style.paddingBottom = "0";
      toast2.style.margin = "0";
      toast2.style.height = "0";
    };
    _setupSwipeListeners = new WeakSet();
    setupSwipeListeners_fn = function(toast2) {
      __privateSet(this, _touchStartRef2, __privateMethod(this, _handleDragStart2, handleDragStart_fn2).bind(this));
      __privateSet(this, _touchMoveRef2, __privateMethod(this, _handleDragMove2, handleDragMove_fn2).bind(this));
      __privateSet(this, _touchReleaseRef2, __privateMethod(this, _handleDragRelease2, handleDragRelease_fn2).bind(this));
      toast2.addEventListener(`${__privateGet(this, _pointerType2)}${__privateGet(this, _pointerType2) === "touch" ? "start" : "down"}`, __privateGet(this, _touchStartRef2));
      toast2.addEventListener(`${__privateGet(this, _pointerType2)}move`, __privateGet(this, _touchMoveRef2));
      toast2.addEventListener(`${__privateGet(this, _pointerType2)}${__privateGet(this, _pointerType2) === "touch" ? "end" : "up"}`, __privateGet(this, _touchReleaseRef2));
      toast2.addEventListener(__privateGet(this, _pointerType2) === "pointer" ? "pointerleave" : "mouseleave", __privateGet(this, _touchReleaseRef2));
    };
    _handleDragStart2 = new WeakSet();
    handleDragStart_fn2 = function(e) {
      if (e.target.closest(".toast-trigger"))
        return;
      const toast2 = e.target.closest(".toast");
      if (toast2.dataset.closing)
        return;
      __privateSet(this, _xStart2, getClientXPosition(e));
      __privateSet(this, _isPressed2, true);
      toast2.style.transitionProperty = "height, margin, padding, transform, box-shadow";
    };
    _handleDragMove2 = new WeakSet();
    handleDragMove_fn2 = function(e) {
      if (!__privateGet(this, _isPressed2))
        return;
      const toast2 = e.target.closest(".toast");
      const client = toast2.getBoundingClientRect();
      const absDiff = Math.abs(getClientXPosition(e) - __privateGet(this, _xStart2));
      toast2.style.left = getClientXPosition(e) - __privateGet(this, _xStart2) + "px";
      toast2.style.opacity = absDiff < client.width ? (0.99 - absDiff / client.width).toString() : "0.01";
    };
    _handleDragRelease2 = new WeakSet();
    handleDragRelease_fn2 = function(e) {
      if (!__privateGet(this, _isPressed2))
        return;
      if (e.cancelable)
        e.preventDefault();
      __privateSet(this, _isPressed2, false);
      const toast2 = e.target.closest(".toast");
      toast2.style.transitionProperty = "height, margin, opacity, padding, transform, box-shadow, left";
      if (Math.abs(getClientXPosition(e) - __privateGet(this, _xStart2)) > toast2.getBoundingClientRect().width / 2) {
        __privateMethod(this, _hide, hide_fn).call(this, toast2);
        toast2.dataset.closing = "true";
      } else {
        toast2.style.left = "0px";
        toast2.style.opacity = 1;
      }
    };
    _handleSwipe = new WeakSet();
    handleSwipe_fn = function(toast2) {
      __privateMethod(this, _setupSwipeListeners, setupSwipeListeners_fn).call(this, toast2);
    };
    _createToast = new WeakSet();
    createToast_fn = function() {
      let toast2 = document.createElement("div");
      toast2.className = "toast shadow-1 " + this.options.classes;
      toast2.innerHTML = __privateGet(this, _content);
      toast2.style.transitionDuration = this.options.animationDuration + "ms";
      if (this.options.isClosable) {
        let trigger = document.createElement("div");
        trigger.className = "toast-trigger";
        trigger.innerHTML = this.options.closableContent;
        trigger.listenerRef = __privateMethod(this, _hide, hide_fn).bind(this, toast2, trigger);
        trigger.addEventListener("click", trigger.listenerRef);
        toast2.appendChild(trigger);
      }
      if (this.options.isSwipeable)
        __privateMethod(this, _handleSwipe, handleSwipe_fn).call(this, toast2);
      __privateMethod(this, _fadeInToast, fadeInToast_fn).call(this, toast2);
      __privateGet(this, _toasters)[this.options.position].appendChild(toast2);
      __privateMethod(this, _fadeOutToast, fadeOutToast_fn).call(this, toast2);
      const height = toast2.clientHeight;
      toast2.style.height = height + "px";
    };
    _hide = new WeakSet();
    hide_fn = function(toast2, trigger, e) {
      if (toast2.isAnimated)
        return;
      let timer = 1;
      if (e) {
        e.preventDefault();
        timer = 0;
        if (this.options.isClosable)
          trigger.removeEventListener("click", trigger.listenerRef);
      }
      toast2.style.opacity = "0";
      toast2.isAnimated = true;
      const delay = timer * this.options.animationDuration + this.options.animationDuration;
      setTimeout(() => {
        __privateMethod(this, _animOut, animOut_fn).call(this, toast2);
      }, delay / 2);
      setTimeout(() => {
        toast2.remove();
        createEvent(toast2, "toast.remove");
        __privateMethod(this, _removeToaster, removeToaster_fn).call(this);
      }, delay * 1.45);
    };
    __publicField(Toast, "getDefaultOptions", () => ToastOptions);
    registerComponent({
      class: Toast,
      name: "Toast"
    });
    const TooltipOptions = {
      content: "",
      animationDelay: 0,
      offset: "10px",
      animationDuration: 200,
      classes: "grey dark-4 light-shadow-2 p-2",
      position: "top"
    };
    class Tooltip extends AxentixComponent {
      constructor(element, options) {
        super();
        __privateAdd(this, _setProperties2);
        __privateAdd(this, _setBasicPosition);
        __privateAdd(this, _manualTransform);
        __privateAdd(this, _onHover);
        __privateAdd(this, _onHoverOut);
        __publicField(this, "options");
        __privateAdd(this, _tooltip, void 0);
        __privateAdd(this, _positionList, void 0);
        __privateAdd(this, _listenerEnterRef, void 0);
        __privateAdd(this, _listenerLeaveRef, void 0);
        __privateAdd(this, _listenerResizeRef, void 0);
        __privateAdd(this, _timeoutRef, void 0);
        __privateAdd(this, _elRect, void 0);
        __privateAdd(this, _tooltipRect, void 0);
        try {
          this.preventDbInstance(element);
          instances.push({ type: "Tooltip", instance: this });
          this.el = document.querySelector(element);
          this.options = getComponentOptions("Tooltip", options, this.el);
          this.setup();
        } catch (error) {
          console.error("[Axentix] Tooltip init error", error);
        }
      }
      setup() {
        if (!this.options.content)
          return console.error(`Tooltip #${this.el.id} : empty content.`);
        createEvent(this.el, "tooltip.setup");
        this.options.position = this.options.position.toLowerCase();
        const tooltips = document.querySelectorAll(".tooltip");
        tooltips.forEach((tooltip2) => {
          if (tooltip2.dataset.tooltipId && tooltip2.dataset.tooltipId === this.el.id)
            __privateSet(this, _tooltip, tooltip2);
        });
        if (!__privateGet(this, _tooltip))
          __privateSet(this, _tooltip, document.createElement("div"));
        if (__privateGet(this, _tooltip).dataset.tooltipId !== this.el.id)
          __privateGet(this, _tooltip).dataset.tooltipId = this.el.id;
        __privateMethod(this, _setProperties2, setProperties_fn2).call(this);
        document.body.appendChild(__privateGet(this, _tooltip));
        __privateSet(this, _positionList, ["right", "left", "top", "bottom"]);
        if (!__privateGet(this, _positionList).includes(this.options.position))
          this.options.position = "top";
        this.setupListeners();
        this.updatePosition();
        __privateGet(this, _tooltip).style.display = "none";
      }
      setupListeners() {
        __privateSet(this, _listenerEnterRef, __privateMethod(this, _onHover, onHover_fn).bind(this));
        __privateSet(this, _listenerLeaveRef, __privateMethod(this, _onHoverOut, onHoverOut_fn).bind(this));
        __privateSet(this, _listenerResizeRef, this.updatePosition.bind(this));
        this.el.addEventListener("mouseenter", __privateGet(this, _listenerEnterRef));
        this.el.addEventListener("mouseleave", __privateGet(this, _listenerLeaveRef));
        window.addEventListener("resize", __privateGet(this, _listenerResizeRef));
      }
      removeListeners() {
        this.el.removeEventListener("mouseenter", __privateGet(this, _listenerEnterRef));
        this.el.removeEventListener("mouseleave", __privateGet(this, _listenerLeaveRef));
        window.removeEventListener("resize", __privateGet(this, _listenerResizeRef));
        __privateSet(this, _listenerEnterRef, void 0);
        __privateSet(this, _listenerLeaveRef, void 0);
        __privateSet(this, _listenerResizeRef, void 0);
      }
      updatePosition() {
        __privateSet(this, _elRect, this.el.getBoundingClientRect());
        __privateMethod(this, _setBasicPosition, setBasicPosition_fn).call(this);
        __privateSet(this, _tooltipRect, __privateGet(this, _tooltip).getBoundingClientRect());
        __privateMethod(this, _manualTransform, manualTransform_fn).call(this);
      }
      show() {
        __privateGet(this, _tooltip).style.display = "block";
        this.updatePosition();
        clearTimeout(__privateGet(this, _timeoutRef));
        __privateSet(this, _timeoutRef, setTimeout(() => {
          createEvent(this.el, "tooltip.show");
          const negativity = this.options.position == "top" || this.options.position == "left" ? "-" : "";
          const verticality = this.options.position == "top" || this.options.position == "bottom" ? "Y" : "X";
          __privateGet(this, _tooltip).style.transform = `translate${verticality}(${negativity}${this.options.offset})`;
          __privateGet(this, _tooltip).style.opacity = "1";
        }, this.options.animationDelay));
      }
      hide() {
        createEvent(this.el, "tooltip.hide");
        clearTimeout(__privateGet(this, _timeoutRef));
        __privateGet(this, _tooltip).style.transform = "translate(0)";
        __privateGet(this, _tooltip).style.opacity = "0";
        __privateSet(this, _timeoutRef, setTimeout(() => {
          __privateGet(this, _tooltip).style.display = "none";
        }, this.options.animationDuration));
      }
      change(options) {
        this.options = getComponentOptions("Tooltip", options, this.el);
        if (!__privateGet(this, _positionList).includes(this.options.position))
          this.options.position = "top";
        __privateMethod(this, _setProperties2, setProperties_fn2).call(this);
        this.updatePosition();
      }
    }
    _tooltip = new WeakMap();
    _positionList = new WeakMap();
    _listenerEnterRef = new WeakMap();
    _listenerLeaveRef = new WeakMap();
    _listenerResizeRef = new WeakMap();
    _timeoutRef = new WeakMap();
    _elRect = new WeakMap();
    _tooltipRect = new WeakMap();
    _setProperties2 = new WeakSet();
    setProperties_fn2 = function() {
      __privateGet(this, _tooltip).style.transform = "translate(0)";
      __privateGet(this, _tooltip).style.opacity = "0";
      __privateGet(this, _tooltip).className = "tooltip " + this.options.classes;
      __privateGet(this, _tooltip).style.transitionDuration = this.options.animationDuration + "ms";
      __privateGet(this, _tooltip).innerHTML = this.options.content;
    };
    _setBasicPosition = new WeakSet();
    setBasicPosition_fn = function() {
      const isVerticalSide = this.options.position == "top" || this.options.position == "bottom";
      if (isVerticalSide) {
        const top = this.options.position === "top" ? __privateGet(this, _elRect).top : __privateGet(this, _elRect).top + __privateGet(this, _elRect).height;
        __privateGet(this, _tooltip).style.top = top + "px";
      } else if (this.options.position == "right") {
        __privateGet(this, _tooltip).style.left = __privateGet(this, _elRect).left + __privateGet(this, _elRect).width + "px";
      }
    };
    _manualTransform = new WeakSet();
    manualTransform_fn = function() {
      const isVerticalSide = this.options.position == "top" || this.options.position == "bottom";
      if (isVerticalSide) {
        __privateGet(this, _tooltip).style.left = __privateGet(this, _elRect).left + __privateGet(this, _elRect).width / 2 - __privateGet(this, _tooltipRect).width / 2 + "px";
      } else {
        __privateGet(this, _tooltip).style.top = __privateGet(this, _elRect).top + __privateGet(this, _elRect).height / 2 - __privateGet(this, _tooltipRect).height / 2 + "px";
      }
      if (this.options.position == "top") {
        __privateGet(this, _tooltip).style.top = __privateGet(this, _tooltipRect).top - __privateGet(this, _tooltipRect).height + "px";
      } else if (this.options.position == "left") {
        __privateGet(this, _tooltip).style.left = __privateGet(this, _elRect).left - __privateGet(this, _tooltipRect).width + "px";
      }
      const scrollY = window.scrollY;
      const tooltipTop = parseFloat(__privateGet(this, _tooltip).style.top);
      if (this.options.position === "top")
        __privateGet(this, _tooltip).style.top = scrollY * 2 + tooltipTop + "px";
      else
        __privateGet(this, _tooltip).style.top = scrollY + tooltipTop + "px";
    };
    _onHover = new WeakSet();
    onHover_fn = function(e) {
      e.preventDefault();
      this.show();
    };
    _onHoverOut = new WeakSet();
    onHoverOut_fn = function(e) {
      e.preventDefault();
      this.hide();
    };
    __publicField(Tooltip, "getDefaultOptions", () => TooltipOptions);
    registerComponent({
      class: Tooltip,
      name: "Tooltip",
      dataDetection: true
    });
    let pointerType = "";
    const targetMap = {};
    const itemMap = {};
    const createWaveItem = (target) => {
      const id = getUid();
      const el = document.createElement("div");
      const container = document.createElement("div");
      const tagName = target.tagName.toLowerCase();
      target.setAttribute("data-waves-id", id);
      container.classList.add("data-waves-item-inner");
      container.setAttribute("data-waves-id", id);
      el.classList.add("data-waves-box");
      el.setAttribute("data-waves-id", id);
      el.appendChild(container);
      targetMap[id] = target;
      itemMap[id] = el;
      if (["img", "video"].includes(tagName))
        target.parentNode.appendChild(el);
      else
        target.appendChild(el);
      return el;
    };
    const createWaves = ({ id, size, x, y, container, item, target }, color) => {
      const waves2 = document.createElement("span");
      let style = `height:${size}px;
           width:${size}px;
           left:${x}px;
           top:${y}px;`;
      if (color)
        style += `${getCssVar("waves-color")}: ${color}`;
      waves2.setAttribute("data-waves-id", id);
      waves2.classList.add("data-waves-item");
      waves2.setAttribute("style", style);
      waves2.addEventListener("animationend", () => {
        container.removeChild(waves2);
        if (!container.children.length && item) {
          if (item.parentNode)
            item.parentNode.removeChild(item);
          target.removeAttribute("data-waves-id");
          delete itemMap[id];
          delete targetMap[id];
        }
      }, { once: true });
      return waves2;
    };
    const getWavesParams = (clientX, clientY, id, target) => {
      const { top, left, width, height } = target.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      let item = itemMap[id];
      if (!item)
        item = createWaveItem(target);
      id = item.getAttribute("data-waves-id") || getUid();
      const container = item.children[0];
      const size = __pow(__pow(Math.max(left + width - clientX, clientX - left), 2) + __pow(Math.max(top + height - clientY, clientY - top), 2), 0.5) * 2;
      return { id, size, x, y, container, item, target };
    };
    const getContainerStyle = (target, item) => {
      const { left, top, width, height } = target.getBoundingClientRect();
      const { left: itemLeft, top: itemTop } = item.getBoundingClientRect();
      const { borderRadius, zIndex } = window.getComputedStyle(target);
      return `left:${left - itemLeft}px;
          top:${top - itemTop}px;
          height:${height}px;
          width:${width}px;
          border-radius:${borderRadius || "0"};
          z-index:${zIndex};`;
    };
    const getTarget = (el, id) => {
      const target = targetMap[id];
      if (target)
        return target;
      if (el.getAttribute("data-waves") !== null)
        return el;
      return el.closest("[data-waves]") || null;
    };
    const handler = (e) => {
      const el = e.target;
      const id = el.getAttribute("data-waves-id") || "";
      const target = getTarget(el, id);
      if (!target || target.getAttribute("disabled"))
        return;
      const color = target.getAttribute("data-waves");
      let { clientX, clientY } = e;
      if (pointerType === "touch") {
        const click = e.touches[0];
        clientX = click.clientX;
        clientY = click.clientY;
      }
      const params = getWavesParams(clientX, clientY, id, target);
      const waves2 = createWaves(params, color);
      const { container, item } = params;
      container.setAttribute("style", getContainerStyle(target, item));
      container.appendChild(waves2);
    };
    const Waves = () => {
      pointerType = getPointerType();
      const eventType = `${pointerType}${pointerType === "touch" ? "start" : "down"}`;
      window.addEventListener(eventType, handler);
    };
    document.addEventListener("DOMContentLoaded", () => Waves());
    const checkBrowserValidity = (input) => {
      return input.checkValidity() || input.validationMessage;
    };
    const setAdvancedMode = (formField, content) => {
      const helper = document.createElement("div");
      helper.axGenerated = true;
      formField.appendChild(helper);
      helper.classList.add("form-helper-invalid");
      helper.innerHTML = content;
    };
    const clearAdvancedMode = (formField) => {
      const helper = formField.querySelector(".form-helper-invalid");
      if (!helper)
        return;
      if (helper.axGenerated)
        helper.remove();
    };
    const resetInputValidation = (formField) => {
      formField.classList.remove("form-valid", "form-invalid", "form-no-helper");
      clearAdvancedMode(formField);
    };
    const validateInput = (input, eType) => {
      const advancedMode = input.getAttribute("data-form-validate");
      let auto = false;
      if (advancedMode) {
        const advSplit = advancedMode.toLowerCase().split(",");
        auto = advSplit.includes("auto");
        if (advSplit.includes("lazy") && eType === "input")
          return;
      }
      const isValid = checkBrowserValidity(input);
      const formField = input.closest(".form-field, .form-file");
      resetInputValidation(formField);
      if (isValid !== true) {
        if (auto && typeof isValid === "string")
          setAdvancedMode(formField, isValid);
        else if (!formField.querySelector(".form-helper-invalid"))
          formField.classList.add("form-no-helper");
        formField.classList.add("form-invalid");
        return false;
      }
      formField.classList.add("form-valid");
      if (!formField.querySelector(".form-helper-valid"))
        formField.classList.add("form-no-helper");
      return true;
    };
    const resetValidation = (form) => {
      const inputs = form.querySelectorAll(`[data-form-validate]`);
      inputs.forEach((input) => resetInputValidation(input.closest(".form-field, .form-file")));
    };
    const validate$1 = (form) => {
      const inputs = form.querySelectorAll(`[data-form-validate]`);
      return [...inputs].map((input) => validateInput(input, "change")).every((b) => b);
    };
    let isInit = true;
    const detectAllInputs = (inputElements) => {
      inputElements.forEach(detectInput);
    };
    const delayDetectionAllInputs = (inputElements) => {
      if (isInit) {
        isInit = false;
        return;
      }
      setTimeout(() => {
        detectAllInputs(inputElements);
      }, 10);
    };
    const detectInput = (input) => {
      const formField = input.closest(".form-field");
      const customSelect = formField.querySelector(".form-custom-select");
      const isActive = formField.classList.contains("active");
      const types = ["date", "month", "week", "time"];
      let hasContent = customSelect && input.tagName === "DIV" && input.innerText.length > 0;
      if (!customSelect)
        hasContent = input.value.length > 0 || input.tagName !== "SELECT" && input.placeholder.length > 0 || input.tagName === "SELECT" || types.some((type) => input.matches(`[type="${type}"]`));
      const isFocused = document.activeElement === input;
      const isDisabled = input.hasAttribute("disabled") || input.hasAttribute("readonly");
      if (input.firstInit) {
        updateInput(input, isActive, hasContent, isFocused, formField, customSelect);
        input.firstInit = false;
        input.isInit = true;
      } else {
        if (!isDisabled)
          updateInput(input, isActive, hasContent, isFocused, formField, customSelect);
      }
    };
    const updateInput = (input, isActive, hasContent, isFocused, formField, customSelect) => {
      const isTextArea = input.type === "textarea";
      const label = formField.querySelector("label:not(.form-check)");
      if (!isActive && (hasContent || isFocused)) {
        formField.classList.add("active");
      } else if (isActive && !(hasContent || isFocused)) {
        formField.classList.remove("active");
      }
      if (!isTextArea)
        setFormPosition(input, formField, customSelect, label);
      else if (label)
        label.style.backgroundColor = getLabelColor(label);
      if (isFocused && !isTextArea)
        formField.classList.add("is-focused");
      else if (!customSelect)
        formField.classList.remove("is-focused");
      if (isFocused && isTextArea)
        formField.classList.add("is-textarea-focused");
      else
        formField.classList.remove("is-textarea-focused");
    };
    const setFormPosition = (input, formField, customSelect, label) => {
      const inputWidth = input.clientWidth, inputLeftOffset = input.offsetLeft;
      const topOffset = input.clientHeight + (customSelect ? customSelect.offsetTop : input.offsetTop) + "px";
      const isBordered = input.closest(".form-material").classList.contains("form-material-bordered");
      formField.style.setProperty(getCssVar("form-material-position"), topOffset);
      let offset = inputLeftOffset, side = "left", width = inputWidth + "px", labelLeft = 0;
      if (formField.classList.contains("form-rtl")) {
        side = "right";
        offset = formField.clientWidth - inputWidth - inputLeftOffset;
      }
      formField.style.setProperty(getCssVar(`form-material-${side}-offset`), offset + "px");
      if (offset != 0)
        labelLeft = inputLeftOffset;
      formField.style.setProperty(getCssVar("form-material-width"), width);
      if (label) {
        label.style.left = labelLeft + "px";
        if (isBordered)
          label.style.backgroundColor = getLabelColor(label);
      }
    };
    const extractBgColor = (target) => {
      const bg = window.getComputedStyle(target).backgroundColor;
      if (bg && !["transparent", "rgba(0, 0, 0, 0)"].includes(bg))
        return bg;
    };
    const getLabelColor = (label) => {
      label.style.backgroundColor = "";
      let target = label;
      while (target.parentElement) {
        const bg = extractBgColor(target);
        if (bg)
          return bg;
        target = target.parentElement;
      }
      const htmlBg = extractBgColor(document.documentElement);
      if (htmlBg)
        return htmlBg;
      return "white";
    };
    const validate = (input, e) => {
      if (input.hasAttribute(`data-form-validate`))
        validateInput(input, e.type);
    };
    const handleListeners = (inputs, e) => {
      inputs.forEach((input) => {
        if (input === e.target)
          detectInput(input);
      });
    };
    const handleResetEvent = (inputs, e) => {
      if (e.target.tagName === "FORM" && e.target.classList.contains("form-material"))
        delayDetectionAllInputs(inputs);
    };
    const setupFormsListeners = (inputElements) => {
      inputElements.forEach((input) => {
        input.firstInit = true;
        input.validateRef = validate.bind(null, input);
        input.addEventListener("input", input.validateRef);
        input.addEventListener("change", input.validateRef);
      });
      detectAllInputs(inputElements);
      const handleListenersRef = handleListeners.bind(null, inputElements);
      document.addEventListener("focus", handleListenersRef, true);
      document.addEventListener("blur", handleListenersRef, true);
      const delayDetectionAllInputsRef = delayDetectionAllInputs.bind(null, inputElements);
      window.addEventListener("pageshow", delayDetectionAllInputsRef);
      const handleResetRef = handleResetEvent.bind(null, inputElements);
      document.addEventListener("reset", handleResetRef);
      const detectAllInputsRef = detectAllInputs.bind(null, inputElements);
      window.addEventListener("resize", detectAllInputsRef);
    };
    const handleFileInput = (input, filePath) => {
      const files = input.files;
      if (files.length > 1) {
        filePath.innerHTML = Array.from(files).map((file) => file.name).join(", ");
      } else if (files[0]) {
        filePath.innerHTML = files[0].name;
      }
    };
    const setupFormFile = (element) => {
      if (element.isInit)
        return;
      element.isInit = true;
      const input = element.querySelector('input[type="file"]');
      const filePath = element.querySelector(".form-file-path");
      input.handleRef = handleFileInput.bind(null, input, filePath);
      input.validateRef = validate.bind(null, input);
      input.addEventListener("change", input.handleRef);
      input.addEventListener("input", input.validateRef);
      input.addEventListener("change", input.validateRef);
    };
    const updateInputsFile = () => {
      const elements = Array.from(document.querySelectorAll(".form-file"));
      try {
        elements.forEach(setupFormFile);
      } catch (error) {
        console.error("[Axentix] Form file error", error);
      }
    };
    const updateInputs = (inputElements = document.querySelectorAll(".form-material .form-field:not(.form-default) .form-control:not(.form-custom-select)")) => {
      const { setupInputs, detectInputs } = Array.from(inputElements).reduce((acc, el) => {
        if (el.isInit)
          acc.detectInputs.push(el);
        else
          acc.setupInputs.push(el);
        return acc;
      }, { setupInputs: [], detectInputs: [] });
      updateInputsFile();
      try {
        if (setupInputs.length > 0)
          setupFormsListeners(setupInputs);
        if (detectInputs.length > 0)
          detectAllInputs(detectInputs);
      } catch (error) {
        console.error("[Axentix] Material forms error", error);
      }
    };
    document.addEventListener("DOMContentLoaded", () => updateInputs());
    const Forms = { updateInputs, validate: validate$1, resetValidation };
    const SelectOptions = {
      inputClasses: ""
    };
    class Select extends AxentixComponent {
      constructor(element, options) {
        super();
        __privateAdd(this, _setupDropdown);
        __privateAdd(this, _createCheckbox);
        __privateAdd(this, _setupContent);
        __privateAdd(this, _setFocusedClass);
        __privateAdd(this, _onClick);
        __privateAdd(this, _select);
        __privateAdd(this, _unSelect);
        __publicField(this, "options");
        __privateAdd(this, _dropdownInstance, void 0);
        __privateAdd(this, _container2, void 0);
        __privateAdd(this, _input, void 0);
        __privateAdd(this, _label, void 0);
        __privateAdd(this, _clickRef, void 0);
        try {
          this.preventDbInstance(element);
          instances.push({ type: "Select", instance: this });
          this.el = document.querySelector(element);
          this.options = getComponentOptions("Select", options, this.el);
          this.setup();
        } catch (error) {
          console.error("[Axentix] Select init error", error);
        }
      }
      setup() {
        this.el.style.display = "none";
        __privateSet(this, _container2, wrap([this.el]));
        __privateGet(this, _container2).className = "form-custom-select";
        __privateMethod(this, _setupDropdown, setupDropdown_fn).call(this);
      }
      reset() {
        this.destroy(true);
        super.reset();
      }
      destroy(withoutSuperCall) {
        if (!withoutSuperCall)
          super.destroy();
        if (__privateGet(this, _dropdownInstance)) {
          __privateGet(this, _dropdownInstance).el.removeEventListener("ax.dropdown.open", __privateGet(this, _clickRef));
          __privateGet(this, _dropdownInstance).el.removeEventListener("ax.dropdown.close", __privateGet(this, _clickRef));
          __privateSet(this, _clickRef, null);
          __privateGet(this, _dropdownInstance).destroy();
          __privateGet(this, _dropdownInstance).el.remove();
          __privateSet(this, _dropdownInstance, null);
        }
        unwrap(__privateGet(this, _container2));
        this.el.classList.add("form-custom-select");
        this.el.style.display = "";
      }
    }
    _dropdownInstance = new WeakMap();
    _container2 = new WeakMap();
    _input = new WeakMap();
    _label = new WeakMap();
    _clickRef = new WeakMap();
    _setupDropdown = new WeakSet();
    setupDropdown_fn = function() {
      const uid = `dropdown-${getUid()}`;
      __privateSet(this, _input, document.createElement("div"));
      __privateGet(this, _input).className = `form-control ${this.options.inputClasses}`;
      __privateGet(this, _input).dataset.target = uid;
      const dropdownContent = document.createElement("div");
      const classes = this.el.className.replace("form-control", "");
      dropdownContent.className = `dropdown-content ${classes}`;
      if (this.el.disabled) {
        __privateGet(this, _input).setAttribute("disabled", "");
        __privateGet(this, _container2).append(__privateGet(this, _input));
        __privateMethod(this, _setupContent, setupContent_fn).call(this, dropdownContent);
        return;
      }
      __privateSet(this, _clickRef, __privateMethod(this, _setFocusedClass, setFocusedClass_fn).bind(this));
      const dropdown2 = document.createElement("div");
      dropdown2.className = "dropdown";
      dropdown2.id = uid;
      dropdown2.addEventListener("ax.dropdown.open", __privateGet(this, _clickRef));
      dropdown2.addEventListener("ax.dropdown.close", __privateGet(this, _clickRef));
      Array.from(this.el.attributes).forEach((a) => {
        if (a.name.startsWith("data-dropdown"))
          dropdown2.setAttribute(a.name, a.value);
      });
      dropdown2.append(__privateGet(this, _input));
      dropdown2.append(dropdownContent);
      __privateGet(this, _container2).append(dropdown2);
      __privateMethod(this, _setupContent, setupContent_fn).call(this, dropdownContent);
      const dropdownClass = getComponentClass("Dropdown");
      __privateSet(this, _dropdownInstance, new dropdownClass(`#${uid}`, {
        closeOnClick: !this.el.multiple,
        preventViewport: true
      }));
      const zindex = window.getComputedStyle(dropdown2).zIndex;
      __privateSet(this, _label, this.el.closest(".form-field").querySelector("label:not(.form-check)"));
      if (__privateGet(this, _label))
        __privateGet(this, _label).style.zIndex = zindex + 5;
    };
    _createCheckbox = new WeakSet();
    createCheckbox_fn = function(content, isDisabled) {
      const formField = document.createElement("div");
      formField.className = "form-field";
      const label = document.createElement("label");
      label.className = "form-check";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      if (isDisabled)
        checkbox.setAttribute("disabled", "");
      const span = document.createElement("span");
      span.innerHTML = content;
      label.append(checkbox, span);
      formField.append(label);
      return formField;
    };
    _setupContent = new WeakSet();
    setupContent_fn = function(dropdownContent) {
      for (const option of this.el.options) {
        const isDisabled = option.hasAttribute("disabled");
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.innerHTML = this.el.multiple ? __privateMethod(this, _createCheckbox, createCheckbox_fn).call(this, option.text, isDisabled).innerHTML : option.text;
        item.axValue = option.value || option.text;
        if (!isDisabled) {
          item.axClickRef = __privateMethod(this, _onClick, onClick_fn).bind(this, item);
          item.addEventListener("click", item.axClickRef);
        } else
          item.classList.add("form-disabled");
        if (option.hasAttribute("selected") || !this.el.multiple && this.el.value === (option.value || option.text))
          __privateMethod(this, _select, select_fn).call(this, item);
        dropdownContent.append(item);
      }
    };
    _setFocusedClass = new WeakSet();
    setFocusedClass_fn = function() {
      __privateGet(this, _input).closest(".form-field").classList.toggle("is-focused");
    };
    _onClick = new WeakSet();
    onClick_fn = function(item, e) {
      e.preventDefault();
      if (!item.classList.contains("form-selected"))
        __privateMethod(this, _select, select_fn).call(this, item);
      else
        __privateMethod(this, _unSelect, unSelect_fn).call(this, item);
    };
    _select = new WeakSet();
    select_fn = function(item) {
      const value = item.axValue;
      if (this.el.multiple)
        item.querySelector("input").checked = true;
      else if (__privateGet(this, _dropdownInstance))
        __privateGet(this, _dropdownInstance).el.querySelectorAll(".dropdown-item").forEach((i) => i.classList.remove("form-selected"));
      item.classList.add("form-selected");
      const computedValue = this.el.multiple ? [...__privateGet(this, _input).innerText.split(", ").filter(Boolean), value].join(", ") : value;
      __privateGet(this, _input).innerText = computedValue;
      this.el.value = computedValue;
      updateInputs([__privateGet(this, _input)]);
    };
    _unSelect = new WeakSet();
    unSelect_fn = function(item) {
      const value = item.axValue;
      item.classList.remove("form-selected");
      let computedValue = "";
      if (this.el.multiple) {
        item.querySelector("input").checked = false;
        const values = __privateGet(this, _input).innerText.split(", ").filter(Boolean);
        const i = values.findIndex((v) => v === value);
        values.splice(i, 1);
        computedValue = values.join(", ");
      }
      __privateGet(this, _input).innerText = computedValue;
      this.el.value = computedValue;
      updateInputs([__privateGet(this, _input)]);
    };
    __publicField(Select, "getDefaultOptions", () => SelectOptions);
    registerComponent({
      class: Select,
      name: "Select",
      dataDetection: true,
      autoInit: {
        enabled: true,
        selector: ".form-custom-select"
      }
    });
    let themeMode = "system";
    let theme = "";
    let enabled = false;
    const enable = () => {
      enabled = true;
      toggleLocalTheme();
    };
    const disable = () => enabled = false;
    const toggle = (forceTheme = "system") => {
      if (!enabled)
        return;
      themeMode = forceTheme;
      if (forceTheme === "system") {
        forceTheme = isDarkMode() ? "dark" : "light";
        localStorage.removeItem("ax-theme");
      }
      if (theme)
        document.documentElement.classList.remove(theme);
      theme = `theme-${forceTheme}`;
      document.documentElement.classList.add(theme);
      Forms.updateInputs();
      createEvent(document.documentElement, "theme.change", { theme });
      if (themeMode !== "system")
        localStorage.setItem("ax-theme", theme);
    };
    const toggleLocalTheme = () => {
      const localTheme = localStorage.getItem("ax-theme");
      if (localTheme)
        toggle(localTheme.replace("theme-", ""));
      else
        toggle(themeMode);
    };
    const setup = () => {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => themeMode === "system" && toggle("system"));
      toggleLocalTheme();
    };
    document.addEventListener("DOMContentLoaded", setup);
    var theme$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      get themeMode() {
        return themeMode;
      },
      get theme() {
        return theme;
      },
      get enabled() {
        return enabled;
      },
      enable,
      disable,
      toggle
    }, Symbol.toStringTag, { value: "Module" }));

    /*!
    * sweetalert2 v11.4.24
    * Released under the MIT License.
    */

    var sweetalert2_all = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
      module.exports = factory() ;
    }(commonjsGlobal, function () {
      const consolePrefix = 'SweetAlert2:';
      /**
       * Filter the unique values into a new array
       * @param arr
       */

      const uniqueArray = arr => {
        const result = [];

        for (let i = 0; i < arr.length; i++) {
          if (result.indexOf(arr[i]) === -1) {
            result.push(arr[i]);
          }
        }

        return result;
      };
      /**
       * Capitalize the first letter of a string
       * @param {string} str
       * @returns {string}
       */

      const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
      /**
       * Standardize console warnings
       * @param {string | array} message
       */

      const warn = message => {
        console.warn("".concat(consolePrefix, " ").concat(typeof message === 'object' ? message.join(' ') : message));
      };
      /**
       * Standardize console errors
       * @param {string} message
       */

      const error = message => {
        console.error("".concat(consolePrefix, " ").concat(message));
      };
      /**
       * Private global state for `warnOnce`
       * @type {Array}
       * @private
       */

      const previousWarnOnceMessages = [];
      /**
       * Show a console warning, but only if it hasn't already been shown
       * @param {string} message
       */

      const warnOnce = message => {
        if (!previousWarnOnceMessages.includes(message)) {
          previousWarnOnceMessages.push(message);
          warn(message);
        }
      };
      /**
       * Show a one-time console warning about deprecated params/methods
       */

      const warnAboutDeprecation = (deprecatedParam, useInstead) => {
        warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
      };
      /**
       * If `arg` is a function, call it (with no arguments or context) and return the result.
       * Otherwise, just pass the value through
       * @param arg
       */

      const callIfFunction = arg => typeof arg === 'function' ? arg() : arg;
      const hasToPromiseFn = arg => arg && typeof arg.toPromise === 'function';
      const asPromise = arg => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
      const isPromise = arg => arg && Promise.resolve(arg) === arg;
      const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];

      const defaultParams = {
        title: '',
        titleText: '',
        text: '',
        html: '',
        footer: '',
        icon: undefined,
        iconColor: undefined,
        iconHtml: undefined,
        template: undefined,
        toast: false,
        showClass: {
          popup: 'swal2-show',
          backdrop: 'swal2-backdrop-show',
          icon: 'swal2-icon-show'
        },
        hideClass: {
          popup: 'swal2-hide',
          backdrop: 'swal2-backdrop-hide',
          icon: 'swal2-icon-hide'
        },
        customClass: {},
        target: 'body',
        color: undefined,
        backdrop: true,
        heightAuto: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: true,
        keydownListenerCapture: false,
        showConfirmButton: true,
        showDenyButton: false,
        showCancelButton: false,
        preConfirm: undefined,
        preDeny: undefined,
        confirmButtonText: 'OK',
        confirmButtonAriaLabel: '',
        confirmButtonColor: undefined,
        denyButtonText: 'No',
        denyButtonAriaLabel: '',
        denyButtonColor: undefined,
        cancelButtonText: 'Cancel',
        cancelButtonAriaLabel: '',
        cancelButtonColor: undefined,
        buttonsStyling: true,
        reverseButtons: false,
        focusConfirm: true,
        focusDeny: false,
        focusCancel: false,
        returnFocus: true,
        showCloseButton: false,
        closeButtonHtml: '&times;',
        closeButtonAriaLabel: 'Close this dialog',
        loaderHtml: '',
        showLoaderOnConfirm: false,
        showLoaderOnDeny: false,
        imageUrl: undefined,
        imageWidth: undefined,
        imageHeight: undefined,
        imageAlt: '',
        timer: undefined,
        timerProgressBar: false,
        width: undefined,
        padding: undefined,
        background: undefined,
        input: undefined,
        inputPlaceholder: '',
        inputLabel: '',
        inputValue: '',
        inputOptions: {},
        inputAutoTrim: true,
        inputAttributes: {},
        inputValidator: undefined,
        returnInputValueOnDeny: false,
        validationMessage: undefined,
        grow: false,
        position: 'center',
        progressSteps: [],
        currentProgressStep: undefined,
        progressStepsDistance: undefined,
        willOpen: undefined,
        didOpen: undefined,
        didRender: undefined,
        willClose: undefined,
        didClose: undefined,
        didDestroy: undefined,
        scrollbarPadding: true
      };
      const updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'color', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'iconHtml', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'preConfirm', 'preDeny', 'progressSteps', 'returnFocus', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'willClose'];
      const deprecatedParams = {};
      const toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusDeny', 'focusCancel', 'returnFocus', 'heightAuto', 'keydownListenerCapture'];
      /**
       * Is valid parameter
       * @param {string} paramName
       */

      const isValidParameter = paramName => {
        return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
      };
      /**
       * Is valid parameter for Swal.update() method
       * @param {string} paramName
       */

      const isUpdatableParameter = paramName => {
        return updatableParams.indexOf(paramName) !== -1;
      };
      /**
       * Is deprecated parameter
       * @param {string} paramName
       */

      const isDeprecatedParameter = paramName => {
        return deprecatedParams[paramName];
      };

      const checkIfParamIsValid = param => {
        if (!isValidParameter(param)) {
          warn("Unknown parameter \"".concat(param, "\""));
        }
      };

      const checkIfToastParamIsValid = param => {
        if (toastIncompatibleParams.includes(param)) {
          warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
        }
      };

      const checkIfParamIsDeprecated = param => {
        if (isDeprecatedParameter(param)) {
          warnAboutDeprecation(param, isDeprecatedParameter(param));
        }
      };
      /**
       * Show relevant warnings for given params
       *
       * @param params
       */


      const showWarningsForParams = params => {
        if (!params.backdrop && params.allowOutsideClick) {
          warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
        }

        for (const param in params) {
          checkIfParamIsValid(param);

          if (params.toast) {
            checkIfToastParamIsValid(param);
          }

          checkIfParamIsDeprecated(param);
        }
      };

      const swalPrefix = 'swal2-';
      /**
       * @param {string[]} items
       * @returns {object}
       */

      const prefix = items => {
        const result = {};

        for (const i in items) {
          result[items[i]] = swalPrefix + items[i];
        }

        return result;
      };
      const swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'show', 'hide', 'close', 'title', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'default-outline', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error', 'no-war']);
      const iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

      /**
       * Gets the popup container which contains the backdrop and the popup itself.
       *
       * @returns {HTMLElement | null}
       */

      const getContainer = () => document.body.querySelector(".".concat(swalClasses.container));
      /**
       * @param {string} selectorString
       * @returns {HTMLElement | null}
       */

      const elementBySelector = selectorString => {
        const container = getContainer();
        return container ? container.querySelector(selectorString) : null;
      };
      /**
       * @param {string} className
       * @returns {HTMLElement | null}
       */

      const elementByClass = className => {
        return elementBySelector(".".concat(className));
      };
      /**
       * @returns {HTMLElement | null}
       */


      const getPopup = () => elementByClass(swalClasses.popup);
      /**
       * @returns {HTMLElement | null}
       */

      const getIcon = () => elementByClass(swalClasses.icon);
      /**
       * @returns {HTMLElement | null}
       */

      const getTitle = () => elementByClass(swalClasses.title);
      /**
       * @returns {HTMLElement | null}
       */

      const getHtmlContainer = () => elementByClass(swalClasses['html-container']);
      /**
       * @returns {HTMLElement | null}
       */

      const getImage = () => elementByClass(swalClasses.image);
      /**
       * @returns {HTMLElement | null}
       */

      const getProgressSteps = () => elementByClass(swalClasses['progress-steps']);
      /**
       * @returns {HTMLElement | null}
       */

      const getValidationMessage = () => elementByClass(swalClasses['validation-message']);
      /**
       * @returns {HTMLElement | null}
       */

      const getConfirmButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
      /**
       * @returns {HTMLElement | null}
       */

      const getDenyButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));
      /**
       * @returns {HTMLElement | null}
       */

      const getInputLabel = () => elementByClass(swalClasses['input-label']);
      /**
       * @returns {HTMLElement | null}
       */

      const getLoader = () => elementBySelector(".".concat(swalClasses.loader));
      /**
       * @returns {HTMLElement | null}
       */

      const getCancelButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
      /**
       * @returns {HTMLElement | null}
       */

      const getActions = () => elementByClass(swalClasses.actions);
      /**
       * @returns {HTMLElement | null}
       */

      const getFooter = () => elementByClass(swalClasses.footer);
      /**
       * @returns {HTMLElement | null}
       */

      const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar']);
      /**
       * @returns {HTMLElement | null}
       */

      const getCloseButton = () => elementByClass(swalClasses.close); // https://github.com/jkup/focusable/blob/master/index.js

      const focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
      /**
       * @returns {HTMLElement[]}
       */

      const getFocusableElements = () => {
        const focusableElementsWithTabindex = Array.from(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) // sort according to tabindex
        .sort((a, b) => {
          const tabindexA = parseInt(a.getAttribute('tabindex'));
          const tabindexB = parseInt(b.getAttribute('tabindex'));

          if (tabindexA > tabindexB) {
            return 1;
          } else if (tabindexA < tabindexB) {
            return -1;
          }

          return 0;
        });
        const otherFocusableElements = Array.from(getPopup().querySelectorAll(focusable)).filter(el => el.getAttribute('tabindex') !== '-1');
        return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(el => isVisible(el));
      };
      /**
       * @returns {boolean}
       */

      const isModal = () => {
        return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses['toast-shown']) && !hasClass(document.body, swalClasses['no-backdrop']);
      };
      /**
       * @returns {boolean}
       */

      const isToast = () => {
        return getPopup() && hasClass(getPopup(), swalClasses.toast);
      };
      /**
       * @returns {boolean}
       */

      const isLoading = () => {
        return getPopup().hasAttribute('data-loading');
      };

      const states = {
        previousBodyPadding: null
      };
      /**
       * Securely set innerHTML of an element
       * https://github.com/sweetalert2/sweetalert2/issues/1926
       *
       * @param {HTMLElement} elem
       * @param {string} html
       */

      const setInnerHtml = (elem, html) => {
        elem.textContent = '';

        if (html) {
          const parser = new DOMParser();
          const parsed = parser.parseFromString(html, "text/html");
          Array.from(parsed.querySelector('head').childNodes).forEach(child => {
            elem.appendChild(child);
          });
          Array.from(parsed.querySelector('body').childNodes).forEach(child => {
            elem.appendChild(child);
          });
        }
      };
      /**
       * @param {HTMLElement} elem
       * @param {string} className
       * @returns {boolean}
       */

      const hasClass = (elem, className) => {
        if (!className) {
          return false;
        }

        const classList = className.split(/\s+/);

        for (let i = 0; i < classList.length; i++) {
          if (!elem.classList.contains(classList[i])) {
            return false;
          }
        }

        return true;
      };
      /**
       * @param {HTMLElement} elem
       * @param {SweetAlertOptions} params
       */

      const removeCustomClasses = (elem, params) => {
        Array.from(elem.classList).forEach(className => {
          if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass).includes(className)) {
            elem.classList.remove(className);
          }
        });
      };
      /**
       * @param {HTMLElement} elem
       * @param {SweetAlertOptions} params
       * @param {string} className
       */


      const applyCustomClass = (elem, params, className) => {
        removeCustomClasses(elem, params);

        if (params.customClass && params.customClass[className]) {
          if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
            return warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(typeof params.customClass[className], "\""));
          }

          addClass(elem, params.customClass[className]);
        }
      };
      /**
       * @param {HTMLElement} popup
       * @param {import('./renderers/renderInput').InputClass} inputClass
       * @returns {HTMLInputElement | null}
       */

      const getInput = (popup, inputClass) => {
        if (!inputClass) {
          return null;
        }

        switch (inputClass) {
          case 'select':
          case 'textarea':
          case 'file':
            return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses[inputClass]));

          case 'checkbox':
            return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.checkbox, " input"));

          case 'radio':
            return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:checked")) || popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:first-child"));

          case 'range':
            return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.range, " input"));

          default:
            return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.input));
        }
      };
      /**
       * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} input
       */

      const focusInput = input => {
        input.focus(); // place cursor at end of text in text input

        if (input.type !== 'file') {
          // http://stackoverflow.com/a/2345915
          const val = input.value;
          input.value = '';
          input.value = val;
        }
      };
      /**
       * @param {HTMLElement | HTMLElement[] | null} target
       * @param {string | string[] | readonly string[]} classList
       * @param {boolean} condition
       */

      const toggleClass = (target, classList, condition) => {
        if (!target || !classList) {
          return;
        }

        if (typeof classList === 'string') {
          classList = classList.split(/\s+/).filter(Boolean);
        }

        classList.forEach(className => {
          if (Array.isArray(target)) {
            target.forEach(elem => {
              condition ? elem.classList.add(className) : elem.classList.remove(className);
            });
          } else {
            condition ? target.classList.add(className) : target.classList.remove(className);
          }
        });
      };
      /**
       * @param {HTMLElement | HTMLElement[] | null} target
       * @param {string | string[] | readonly string[]} classList
       */

      const addClass = (target, classList) => {
        toggleClass(target, classList, true);
      };
      /**
       * @param {HTMLElement | HTMLElement[] | null} target
       * @param {string | string[] | readonly string[]} classList
       */

      const removeClass = (target, classList) => {
        toggleClass(target, classList, false);
      };
      /**
       * Get direct child of an element by class name
       *
       * @param {HTMLElement} elem
       * @param {string} className
       * @returns {HTMLElement | null}
       */

      const getDirectChildByClass = (elem, className) => {
        const children = Array.from(elem.children);

        for (let i = 0; i < children.length; i++) {
          const child = children[i];

          if (child instanceof HTMLElement && hasClass(child, className)) {
            return child;
          }
        }
      };
      /**
       * @param {HTMLElement} elem
       * @param {string} property
       * @param {*} value
       */

      const applyNumericalStyle = (elem, property, value) => {
        if (value === "".concat(parseInt(value))) {
          value = parseInt(value);
        }

        if (value || parseInt(value) === 0) {
          elem.style[property] = typeof value === 'number' ? "".concat(value, "px") : value;
        } else {
          elem.style.removeProperty(property);
        }
      };
      /**
       * @param {HTMLElement} elem
       * @param {string} display
       */

      const show = function (elem) {
        let display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
        elem.style.display = display;
      };
      /**
       * @param {HTMLElement} elem
       */

      const hide = elem => {
        elem.style.display = 'none';
      };
      /**
       * @param {HTMLElement} parent
       * @param {string} selector
       * @param {string} property
       * @param {string} value
       */

      const setStyle = (parent, selector, property, value) => {
        /** @type {HTMLElement} */
        const el = parent.querySelector(selector);

        if (el) {
          el.style[property] = value;
        }
      };
      /**
       * @param {HTMLElement} elem
       * @param {any} condition
       * @param {string} display
       */

      const toggle = function (elem, condition) {
        let display = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'flex';
        condition ? show(elem, display) : hide(elem);
      };
      /**
       * borrowed from jquery $(elem).is(':visible') implementation
       *
       * @param {HTMLElement} elem
       * @returns {boolean}
       */

      const isVisible = elem => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
      /**
       * @returns {boolean}
       */

      const allButtonsAreHidden = () => !isVisible(getConfirmButton()) && !isVisible(getDenyButton()) && !isVisible(getCancelButton());
      /**
       * @returns {boolean}
       */

      const isScrollable = elem => !!(elem.scrollHeight > elem.clientHeight);
      /**
       * borrowed from https://stackoverflow.com/a/46352119
       *
       * @param {HTMLElement} elem
       * @returns {boolean}
       */

      const hasCssAnimation = elem => {
        const style = window.getComputedStyle(elem);
        const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
        const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
        return animDuration > 0 || transDuration > 0;
      };
      /**
       * @param {number} timer
       * @param {boolean} reset
       */

      const animateTimerProgressBar = function (timer) {
        let reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        const timerProgressBar = getTimerProgressBar();

        if (isVisible(timerProgressBar)) {
          if (reset) {
            timerProgressBar.style.transition = 'none';
            timerProgressBar.style.width = '100%';
          }

          setTimeout(() => {
            timerProgressBar.style.transition = "width ".concat(timer / 1000, "s linear");
            timerProgressBar.style.width = '0%';
          }, 10);
        }
      };
      const stopTimerProgressBar = () => {
        const timerProgressBar = getTimerProgressBar();
        const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
        timerProgressBar.style.removeProperty('transition');
        timerProgressBar.style.width = '100%';
        const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
        const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
        timerProgressBar.style.removeProperty('transition');
        timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
      };

      /**
       * Detect Node env
       *
       * @returns {boolean}
       */
      const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined';

      const RESTORE_FOCUS_TIMEOUT = 100;

      /** @type {GlobalState} */

      const globalState = {};

      const focusPreviousActiveElement = () => {
        if (globalState.previousActiveElement instanceof HTMLElement) {
          globalState.previousActiveElement.focus();
          globalState.previousActiveElement = null;
        } else if (document.body) {
          document.body.focus();
        }
      };
      /**
       * Restore previous active (focused) element
       *
       * @param {boolean} returnFocus
       * @returns {Promise}
       */


      const restoreActiveElement = returnFocus => {
        return new Promise(resolve => {
          if (!returnFocus) {
            return resolve();
          }

          const x = window.scrollX;
          const y = window.scrollY;
          globalState.restoreFocusTimeout = setTimeout(() => {
            focusPreviousActiveElement();
            resolve();
          }, RESTORE_FOCUS_TIMEOUT); // issues/900

          window.scrollTo(x, y);
        });
      };

      const sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses['html-container'], "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n   <div class=\"").concat(swalClasses.icon, "\"></div>\n   <img class=\"").concat(swalClasses.image, "\" />\n   <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n   <div class=\"").concat(swalClasses['html-container'], "\" id=\"").concat(swalClasses['html-container'], "\"></div>\n   <input class=\"").concat(swalClasses.input, "\" />\n   <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n   <div class=\"").concat(swalClasses.range, "\">\n     <input type=\"range\" />\n     <output></output>\n   </div>\n   <select class=\"").concat(swalClasses.select, "\"></select>\n   <div class=\"").concat(swalClasses.radio, "\"></div>\n   <label for=\"").concat(swalClasses.checkbox, "\" class=\"").concat(swalClasses.checkbox, "\">\n     <input type=\"checkbox\" />\n     <span class=\"").concat(swalClasses.label, "\"></span>\n   </label>\n   <textarea class=\"").concat(swalClasses.textarea, "\"></textarea>\n   <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <div class=\"").concat(swalClasses.loader, "\"></div>\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.deny, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\"></div>\n   <div class=\"").concat(swalClasses['timer-progress-bar-container'], "\">\n     <div class=\"").concat(swalClasses['timer-progress-bar'], "\"></div>\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');
      /**
       * @returns {boolean}
       */

      const resetOldContainer = () => {
        const oldContainer = getContainer();

        if (!oldContainer) {
          return false;
        }

        oldContainer.remove();
        removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
        return true;
      };

      const resetValidationMessage = () => {
        globalState.currentInstance.resetValidationMessage();
      };

      const addInputChangeListeners = () => {
        const popup = getPopup();
        const input = getDirectChildByClass(popup, swalClasses.input);
        const file = getDirectChildByClass(popup, swalClasses.file);
        /** @type {HTMLInputElement} */

        const range = popup.querySelector(".".concat(swalClasses.range, " input"));
        /** @type {HTMLOutputElement} */

        const rangeOutput = popup.querySelector(".".concat(swalClasses.range, " output"));
        const select = getDirectChildByClass(popup, swalClasses.select);
        /** @type {HTMLInputElement} */

        const checkbox = popup.querySelector(".".concat(swalClasses.checkbox, " input"));
        const textarea = getDirectChildByClass(popup, swalClasses.textarea);
        input.oninput = resetValidationMessage;
        file.onchange = resetValidationMessage;
        select.onchange = resetValidationMessage;
        checkbox.onchange = resetValidationMessage;
        textarea.oninput = resetValidationMessage;

        range.oninput = () => {
          resetValidationMessage();
          rangeOutput.value = range.value;
        };

        range.onchange = () => {
          resetValidationMessage();
          rangeOutput.value = range.value;
        };
      };
      /**
       * @param {string | HTMLElement} target
       * @returns {HTMLElement}
       */


      const getTarget = target => typeof target === 'string' ? document.querySelector(target) : target;
      /**
       * @param {SweetAlertOptions} params
       */


      const setupAccessibility = params => {
        const popup = getPopup();
        popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
        popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');

        if (!params.toast) {
          popup.setAttribute('aria-modal', 'true');
        }
      };
      /**
       * @param {HTMLElement} targetElement
       */


      const setupRTL = targetElement => {
        if (window.getComputedStyle(targetElement).direction === 'rtl') {
          addClass(getContainer(), swalClasses.rtl);
        }
      };
      /**
       * Add modal + backdrop + no-war message for Russians to DOM
       *
       * @param {SweetAlertOptions} params
       */


      const init = params => {
        // Clean up the old popup container if it exists
        const oldContainerExisted = resetOldContainer();
        /* istanbul ignore if */

        if (isNodeEnv()) {
          error('SweetAlert2 requires document to initialize');
          return;
        }

        const container = document.createElement('div');
        container.className = swalClasses.container;

        if (oldContainerExisted) {
          addClass(container, swalClasses['no-transition']);
        }

        setInnerHtml(container, sweetHTML);
        const targetElement = getTarget(params.target);
        targetElement.appendChild(container);
        setupAccessibility(params);
        setupRTL(targetElement);
        addInputChangeListeners();
      };

      /**
       * @param {HTMLElement | object | string} param
       * @param {HTMLElement} target
       */

      const parseHtmlToContainer = (param, target) => {
        // DOM element
        if (param instanceof HTMLElement) {
          target.appendChild(param);
        } // Object
        else if (typeof param === 'object') {
          handleObject(param, target);
        } // Plain string
        else if (param) {
          setInnerHtml(target, param);
        }
      };
      /**
       * @param {object} param
       * @param {HTMLElement} target
       */

      const handleObject = (param, target) => {
        // JQuery element(s)
        if (param.jquery) {
          handleJqueryElem(target, param);
        } // For other objects use their string representation
        else {
          setInnerHtml(target, param.toString());
        }
      };
      /**
       * @param {HTMLElement} target
       * @param {HTMLElement} elem
       */


      const handleJqueryElem = (target, elem) => {
        target.textContent = '';

        if (0 in elem) {
          for (let i = 0; (i in elem); i++) {
            target.appendChild(elem[i].cloneNode(true));
          }
        } else {
          target.appendChild(elem.cloneNode(true));
        }
      };

      /**
       * @returns {'webkitAnimationEnd' | 'animationend' | false}
       */

      const animationEndEvent = (() => {
        // Prevent run in Node env

        /* istanbul ignore if */
        if (isNodeEnv()) {
          return false;
        }

        const testEl = document.createElement('div');
        const transEndEventNames = {
          WebkitAnimation: 'webkitAnimationEnd',
          // Chrome, Safari and Opera
          animation: 'animationend' // Standard syntax

        };

        for (const i in transEndEventNames) {
          if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== 'undefined') {
            return transEndEventNames[i];
          }
        }

        return false;
      })();

      /**
       * Measure scrollbar width for padding body during modal show/hide
       * https://github.com/twbs/bootstrap/blob/master/js/src/modal.js
       *
       * @returns {number}
       */

      const measureScrollbar = () => {
        const scrollDiv = document.createElement('div');
        scrollDiv.className = swalClasses['scrollbar-measure'];
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
      };

      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const renderActions = (instance, params) => {
        const actions = getActions();
        const loader = getLoader(); // Actions (buttons) wrapper

        if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
          hide(actions);
        } else {
          show(actions);
        } // Custom class


        applyCustomClass(actions, params, 'actions'); // Render all the buttons

        renderButtons(actions, loader, params); // Loader

        setInnerHtml(loader, params.loaderHtml);
        applyCustomClass(loader, params, 'loader');
      };
      /**
       * @param {HTMLElement} actions
       * @param {HTMLElement} loader
       * @param {SweetAlertOptions} params
       */

      function renderButtons(actions, loader, params) {
        const confirmButton = getConfirmButton();
        const denyButton = getDenyButton();
        const cancelButton = getCancelButton(); // Render buttons

        renderButton(confirmButton, 'confirm', params);
        renderButton(denyButton, 'deny', params);
        renderButton(cancelButton, 'cancel', params);
        handleButtonsStyling(confirmButton, denyButton, cancelButton, params);

        if (params.reverseButtons) {
          if (params.toast) {
            actions.insertBefore(cancelButton, confirmButton);
            actions.insertBefore(denyButton, confirmButton);
          } else {
            actions.insertBefore(cancelButton, loader);
            actions.insertBefore(denyButton, loader);
            actions.insertBefore(confirmButton, loader);
          }
        }
      }
      /**
       * @param {HTMLElement} confirmButton
       * @param {HTMLElement} denyButton
       * @param {HTMLElement} cancelButton
       * @param {SweetAlertOptions} params
       */


      function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
        if (!params.buttonsStyling) {
          return removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
        }

        addClass([confirmButton, denyButton, cancelButton], swalClasses.styled); // Buttons background colors

        if (params.confirmButtonColor) {
          confirmButton.style.backgroundColor = params.confirmButtonColor;
          addClass(confirmButton, swalClasses['default-outline']);
        }

        if (params.denyButtonColor) {
          denyButton.style.backgroundColor = params.denyButtonColor;
          addClass(denyButton, swalClasses['default-outline']);
        }

        if (params.cancelButtonColor) {
          cancelButton.style.backgroundColor = params.cancelButtonColor;
          addClass(cancelButton, swalClasses['default-outline']);
        }
      }
      /**
       * @param {HTMLElement} button
       * @param {'confirm' | 'deny' | 'cancel'} buttonType
       * @param {SweetAlertOptions} params
       */


      function renderButton(button, buttonType, params) {
        toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], 'inline-block');
        setInnerHtml(button, params["".concat(buttonType, "ButtonText")]); // Set caption text

        button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")]); // ARIA label
        // Add buttons custom classes

        button.className = swalClasses[buttonType];
        applyCustomClass(button, params, "".concat(buttonType, "Button"));
        addClass(button, params["".concat(buttonType, "ButtonClass")]);
      }

      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const renderContainer = (instance, params) => {
        const container = getContainer();

        if (!container) {
          return;
        }

        handleBackdropParam(container, params.backdrop);
        handlePositionParam(container, params.position);
        handleGrowParam(container, params.grow); // Custom class

        applyCustomClass(container, params, 'container');
      };
      /**
       * @param {HTMLElement} container
       * @param {SweetAlertOptions['backdrop']} backdrop
       */

      function handleBackdropParam(container, backdrop) {
        if (typeof backdrop === 'string') {
          container.style.background = backdrop;
        } else if (!backdrop) {
          addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
        }
      }
      /**
       * @param {HTMLElement} container
       * @param {SweetAlertOptions['position']} position
       */


      function handlePositionParam(container, position) {
        if (position in swalClasses) {
          addClass(container, swalClasses[position]);
        } else {
          warn('The "position" parameter is not valid, defaulting to "center"');
          addClass(container, swalClasses.center);
        }
      }
      /**
       * @param {HTMLElement} container
       * @param {SweetAlertOptions['grow']} grow
       */


      function handleGrowParam(container, grow) {
        if (grow && typeof grow === 'string') {
          const growClass = "grow-".concat(grow);

          if (growClass in swalClasses) {
            addClass(container, swalClasses[growClass]);
          }
        }
      }

      /**
       * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
       * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
       * This is the approach that Babel will probably take to implement private methods/fields
       *   https://github.com/tc39/proposal-private-methods
       *   https://github.com/babel/babel/pull/7555
       * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
       *   then we can use that language feature.
       */
      var privateProps = {
        awaitingPromise: new WeakMap(),
        promise: new WeakMap(),
        innerParams: new WeakMap(),
        domCache: new WeakMap()
      };

      /// <reference path="../../../../sweetalert2.d.ts"/>
      /** @type {InputClass[]} */

      const inputClasses = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const renderInput = (instance, params) => {
        const popup = getPopup();
        const innerParams = privateProps.innerParams.get(instance);
        const rerender = !innerParams || params.input !== innerParams.input;
        inputClasses.forEach(inputClass => {
          const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]); // set attributes

          setAttributes(inputClass, params.inputAttributes); // set class

          inputContainer.className = swalClasses[inputClass];

          if (rerender) {
            hide(inputContainer);
          }
        });

        if (params.input) {
          if (rerender) {
            showInput(params);
          } // set custom class


          setCustomClass(params);
        }
      };
      /**
       * @param {SweetAlertOptions} params
       */

      const showInput = params => {
        if (!renderInputType[params.input]) {
          return error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
        }

        const inputContainer = getInputContainer(params.input);
        const input = renderInputType[params.input](inputContainer, params);
        show(inputContainer); // input autofocus

        setTimeout(() => {
          focusInput(input);
        });
      };
      /**
       * @param {HTMLInputElement} input
       */


      const removeAttributes = input => {
        for (let i = 0; i < input.attributes.length; i++) {
          const attrName = input.attributes[i].name;

          if (!['type', 'value', 'style'].includes(attrName)) {
            input.removeAttribute(attrName);
          }
        }
      };
      /**
       * @param {InputClass} inputClass
       * @param {SweetAlertOptions['inputAttributes']} inputAttributes
       */


      const setAttributes = (inputClass, inputAttributes) => {
        const input = getInput(getPopup(), inputClass);

        if (!input) {
          return;
        }

        removeAttributes(input);

        for (const attr in inputAttributes) {
          input.setAttribute(attr, inputAttributes[attr]);
        }
      };
      /**
       * @param {SweetAlertOptions} params
       */


      const setCustomClass = params => {
        const inputContainer = getInputContainer(params.input);

        if (typeof params.customClass === 'object') {
          addClass(inputContainer, params.customClass.input);
        }
      };
      /**
       * @param {HTMLInputElement | HTMLTextAreaElement} input
       * @param {SweetAlertOptions} params
       */


      const setInputPlaceholder = (input, params) => {
        if (!input.placeholder || params.inputPlaceholder) {
          input.placeholder = params.inputPlaceholder;
        }
      };
      /**
       * @param {Input} input
       * @param {Input} prependTo
       * @param {SweetAlertOptions} params
       */


      const setInputLabel = (input, prependTo, params) => {
        if (params.inputLabel) {
          input.id = swalClasses.input;
          const label = document.createElement('label');
          const labelClass = swalClasses['input-label'];
          label.setAttribute('for', input.id);
          label.className = labelClass;

          if (typeof params.customClass === 'object') {
            addClass(label, params.customClass.inputLabel);
          }

          label.innerText = params.inputLabel;
          prependTo.insertAdjacentElement('beforebegin', label);
        }
      };
      /**
       * @param {SweetAlertOptions['input']} inputType
       * @returns {HTMLElement}
       */


      const getInputContainer = inputType => {
        return getDirectChildByClass(getPopup(), swalClasses[inputType] || swalClasses.input);
      };
      /**
       * @param {HTMLInputElement | HTMLOutputElement | HTMLTextAreaElement} input
       * @param {SweetAlertOptions['inputValue']} inputValue
       */


      const checkAndSetInputValue = (input, inputValue) => {
        if (['string', 'number'].includes(typeof inputValue)) {
          input.value = "".concat(inputValue);
        } else if (!isPromise(inputValue)) {
          warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(typeof inputValue, "\""));
        }
      };
      /** @type Record<string, (input: Input | HTMLElement, params: SweetAlertOptions) => Input> */


      const renderInputType = {};
      /**
       * @param {HTMLInputElement} input
       * @param {SweetAlertOptions} params
       * @returns {HTMLInputElement}
       */

      renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = (input, params) => {
        checkAndSetInputValue(input, params.inputValue);
        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        input.type = params.input;
        return input;
      };
      /**
       * @param {HTMLInputElement} input
       * @param {SweetAlertOptions} params
       * @returns {HTMLInputElement}
       */


      renderInputType.file = (input, params) => {
        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        return input;
      };
      /**
       * @param {HTMLInputElement} range
       * @param {SweetAlertOptions} params
       * @returns {HTMLInputElement}
       */


      renderInputType.range = (range, params) => {
        const rangeInput = range.querySelector('input');
        const rangeOutput = range.querySelector('output');
        checkAndSetInputValue(rangeInput, params.inputValue);
        rangeInput.type = params.input;
        checkAndSetInputValue(rangeOutput, params.inputValue);
        setInputLabel(rangeInput, range, params);
        return range;
      };
      /**
       * @param {HTMLSelectElement} select
       * @param {SweetAlertOptions} params
       * @returns {HTMLSelectElement}
       */


      renderInputType.select = (select, params) => {
        select.textContent = '';

        if (params.inputPlaceholder) {
          const placeholder = document.createElement('option');
          setInnerHtml(placeholder, params.inputPlaceholder);
          placeholder.value = '';
          placeholder.disabled = true;
          placeholder.selected = true;
          select.appendChild(placeholder);
        }

        setInputLabel(select, select, params);
        return select;
      };
      /**
       * @param {HTMLInputElement} radio
       * @returns {HTMLInputElement}
       */


      renderInputType.radio = radio => {
        radio.textContent = '';
        return radio;
      };
      /**
       * @param {HTMLLabelElement} checkboxContainer
       * @param {SweetAlertOptions} params
       * @returns {HTMLInputElement}
       */


      renderInputType.checkbox = (checkboxContainer, params) => {
        const checkbox = getInput(getPopup(), 'checkbox');
        checkbox.value = '1';
        checkbox.id = swalClasses.checkbox;
        checkbox.checked = Boolean(params.inputValue);
        const label = checkboxContainer.querySelector('span');
        setInnerHtml(label, params.inputPlaceholder);
        return checkbox;
      };
      /**
       * @param {HTMLTextAreaElement} textarea
       * @param {SweetAlertOptions} params
       * @returns {HTMLTextAreaElement}
       */


      renderInputType.textarea = (textarea, params) => {
        checkAndSetInputValue(textarea, params.inputValue);
        setInputPlaceholder(textarea, params);
        setInputLabel(textarea, textarea, params);
        /**
         * @param {HTMLElement} el
         * @returns {number}
         */

        const getMargin = el => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight); // https://github.com/sweetalert2/sweetalert2/issues/2291


        setTimeout(() => {
          // https://github.com/sweetalert2/sweetalert2/issues/1699
          if ('MutationObserver' in window) {
            const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);

            const textareaResizeHandler = () => {
              const textareaWidth = textarea.offsetWidth + getMargin(textarea);

              if (textareaWidth > initialPopupWidth) {
                getPopup().style.width = "".concat(textareaWidth, "px");
              } else {
                getPopup().style.width = null;
              }
            };

            new MutationObserver(textareaResizeHandler).observe(textarea, {
              attributes: true,
              attributeFilter: ['style']
            });
          }
        });
        return textarea;
      };

      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const renderContent = (instance, params) => {
        const htmlContainer = getHtmlContainer();
        applyCustomClass(htmlContainer, params, 'htmlContainer'); // Content as HTML

        if (params.html) {
          parseHtmlToContainer(params.html, htmlContainer);
          show(htmlContainer, 'block');
        } // Content as plain text
        else if (params.text) {
          htmlContainer.textContent = params.text;
          show(htmlContainer, 'block');
        } // No content
        else {
          hide(htmlContainer);
        }

        renderInput(instance, params);
      };

      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const renderFooter = (instance, params) => {
        const footer = getFooter();
        toggle(footer, params.footer);

        if (params.footer) {
          parseHtmlToContainer(params.footer, footer);
        } // Custom class


        applyCustomClass(footer, params, 'footer');
      };

      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const renderCloseButton = (instance, params) => {
        const closeButton = getCloseButton();
        setInnerHtml(closeButton, params.closeButtonHtml); // Custom class

        applyCustomClass(closeButton, params, 'closeButton');
        toggle(closeButton, params.showCloseButton);
        closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
      };

      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const renderIcon = (instance, params) => {
        const innerParams = privateProps.innerParams.get(instance);
        const icon = getIcon(); // if the given icon already rendered, apply the styling without re-rendering the icon

        if (innerParams && params.icon === innerParams.icon) {
          // Custom or default content
          setContent(icon, params);
          applyStyles(icon, params);
          return;
        }

        if (!params.icon && !params.iconHtml) {
          hide(icon);
          return;
        }

        if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
          error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
          hide(icon);
          return;
        }

        show(icon); // Custom or default content

        setContent(icon, params);
        applyStyles(icon, params); // Animate icon

        addClass(icon, params.showClass.icon);
      };
      /**
       * @param {HTMLElement} icon
       * @param {SweetAlertOptions} params
       */

      const applyStyles = (icon, params) => {
        for (const iconType in iconTypes) {
          if (params.icon !== iconType) {
            removeClass(icon, iconTypes[iconType]);
          }
        }

        addClass(icon, iconTypes[params.icon]); // Icon color

        setColor(icon, params); // Success icon background color

        adjustSuccessIconBackgroundColor(); // Custom class

        applyCustomClass(icon, params, 'icon');
      }; // Adjust success icon background color to match the popup background color


      const adjustSuccessIconBackgroundColor = () => {
        const popup = getPopup();
        const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
        /** @type {NodeListOf<HTMLElement>} */

        const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');

        for (let i = 0; i < successIconParts.length; i++) {
          successIconParts[i].style.backgroundColor = popupBackgroundColor;
        }
      };

      const successIconHtml = "\n  <div class=\"swal2-success-circular-line-left\"></div>\n  <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n  <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n  <div class=\"swal2-success-circular-line-right\"></div>\n";
      const errorIconHtml = "\n  <span class=\"swal2-x-mark\">\n    <span class=\"swal2-x-mark-line-left\"></span>\n    <span class=\"swal2-x-mark-line-right\"></span>\n  </span>\n";
      /**
       * @param {HTMLElement} icon
       * @param {SweetAlertOptions} params
       */

      const setContent = (icon, params) => {
        let oldContent = icon.innerHTML;
        let newContent;

        if (params.iconHtml) {
          newContent = iconContent(params.iconHtml);
        } else if (params.icon === 'success') {
          newContent = successIconHtml;
          oldContent = oldContent.replace(/ style=".*?"/g, ''); // undo adjustSuccessIconBackgroundColor()
        } else if (params.icon === 'error') {
          newContent = errorIconHtml;
        } else {
          const defaultIconHtml = {
            question: '?',
            warning: '!',
            info: 'i'
          };
          newContent = iconContent(defaultIconHtml[params.icon]);
        }

        if (oldContent.trim() !== newContent.trim()) {
          setInnerHtml(icon, newContent);
        }
      };
      /**
       * @param {HTMLElement} icon
       * @param {SweetAlertOptions} params
       */


      const setColor = (icon, params) => {
        if (!params.iconColor) {
          return;
        }

        icon.style.color = params.iconColor;
        icon.style.borderColor = params.iconColor;

        for (const sel of ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']) {
          setStyle(icon, sel, 'backgroundColor', params.iconColor);
        }

        setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor);
      };
      /**
       * @param {string} content
       * @returns {string}
       */


      const iconContent = content => "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");

      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const renderImage = (instance, params) => {
        const image = getImage();

        if (!params.imageUrl) {
          return hide(image);
        }

        show(image, ''); // Src, alt

        image.setAttribute('src', params.imageUrl);
        image.setAttribute('alt', params.imageAlt); // Width, height

        applyNumericalStyle(image, 'width', params.imageWidth);
        applyNumericalStyle(image, 'height', params.imageHeight); // Class

        image.className = swalClasses.image;
        applyCustomClass(image, params, 'image');
      };

      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const renderProgressSteps = (instance, params) => {
        const progressStepsContainer = getProgressSteps();

        if (!params.progressSteps || params.progressSteps.length === 0) {
          return hide(progressStepsContainer);
        }

        show(progressStepsContainer);
        progressStepsContainer.textContent = '';

        if (params.currentProgressStep >= params.progressSteps.length) {
          warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
        }

        params.progressSteps.forEach((step, index) => {
          const stepEl = createStepElement(step);
          progressStepsContainer.appendChild(stepEl);

          if (index === params.currentProgressStep) {
            addClass(stepEl, swalClasses['active-progress-step']);
          }

          if (index !== params.progressSteps.length - 1) {
            const lineEl = createLineElement(params);
            progressStepsContainer.appendChild(lineEl);
          }
        });
      };
      /**
       * @param {string} step
       * @returns {HTMLLIElement}
       */

      const createStepElement = step => {
        const stepEl = document.createElement('li');
        addClass(stepEl, swalClasses['progress-step']);
        setInnerHtml(stepEl, step);
        return stepEl;
      };
      /**
       * @param {SweetAlertOptions} params
       * @returns {HTMLLIElement}
       */


      const createLineElement = params => {
        const lineEl = document.createElement('li');
        addClass(lineEl, swalClasses['progress-step-line']);

        if (params.progressStepsDistance) {
          applyNumericalStyle(lineEl, 'width', params.progressStepsDistance);
        }

        return lineEl;
      };

      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const renderTitle = (instance, params) => {
        const title = getTitle();
        toggle(title, params.title || params.titleText, 'block');

        if (params.title) {
          parseHtmlToContainer(params.title, title);
        }

        if (params.titleText) {
          title.innerText = params.titleText;
        } // Custom class


        applyCustomClass(title, params, 'title');
      };

      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const renderPopup = (instance, params) => {
        const container = getContainer();
        const popup = getPopup(); // Width
        // https://github.com/sweetalert2/sweetalert2/issues/2170

        if (params.toast) {
          applyNumericalStyle(container, 'width', params.width);
          popup.style.width = '100%';
          popup.insertBefore(getLoader(), getIcon());
        } else {
          applyNumericalStyle(popup, 'width', params.width);
        } // Padding


        applyNumericalStyle(popup, 'padding', params.padding); // Color

        if (params.color) {
          popup.style.color = params.color;
        } // Background


        if (params.background) {
          popup.style.background = params.background;
        }

        hide(getValidationMessage()); // Classes

        addClasses(popup, params);
      };
      /**
       * @param {HTMLElement} popup
       * @param {SweetAlertOptions} params
       */

      const addClasses = (popup, params) => {
        // Default Class + showClass when updating Swal.update({})
        popup.className = "".concat(swalClasses.popup, " ").concat(isVisible(popup) ? params.showClass.popup : '');

        if (params.toast) {
          addClass([document.documentElement, document.body], swalClasses['toast-shown']);
          addClass(popup, swalClasses.toast);
        } else {
          addClass(popup, swalClasses.modal);
        } // Custom class


        applyCustomClass(popup, params, 'popup');

        if (typeof params.customClass === 'string') {
          addClass(popup, params.customClass);
        } // Icon class (#1842)


        if (params.icon) {
          addClass(popup, swalClasses["icon-".concat(params.icon)]);
        }
      };

      /**
       * @param {SweetAlert2} instance
       * @param {SweetAlertOptions} params
       */

      const render = (instance, params) => {
        renderPopup(instance, params);
        renderContainer(instance, params);
        renderProgressSteps(instance, params);
        renderIcon(instance, params);
        renderImage(instance, params);
        renderTitle(instance, params);
        renderCloseButton(instance, params);
        renderContent(instance, params);
        renderActions(instance, params);
        renderFooter(instance, params);

        if (typeof params.didRender === 'function') {
          params.didRender(getPopup());
        }
      };

      const DismissReason = Object.freeze({
        cancel: 'cancel',
        backdrop: 'backdrop',
        close: 'close',
        esc: 'esc',
        timer: 'timer'
      });

      // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
      // elements not within the active modal dialog will not be surfaced if a user opens a screen
      // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

      const setAriaHidden = () => {
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach(el => {
          if (el === getContainer() || el.contains(getContainer())) {
            return;
          }

          if (el.hasAttribute('aria-hidden')) {
            el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden'));
          }

          el.setAttribute('aria-hidden', 'true');
        });
      };
      const unsetAriaHidden = () => {
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach(el => {
          if (el.hasAttribute('data-previous-aria-hidden')) {
            el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden'));
            el.removeAttribute('data-previous-aria-hidden');
          } else {
            el.removeAttribute('aria-hidden');
          }
        });
      };

      const swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];
      const getTemplateParams = params => {
        const template = typeof params.template === 'string' ? document.querySelector(params.template) : params.template;

        if (!template) {
          return {};
        }
        /** @type {DocumentFragment} */


        const templateContent = template.content;
        showWarningsForElements(templateContent);
        const result = Object.assign(getSwalParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
        return result;
      };
      /**
       * @param {DocumentFragment} templateContent
       */

      const getSwalParams = templateContent => {
        const result = {};
        /** @type {HTMLElement[]} */

        const swalParams = Array.from(templateContent.querySelectorAll('swal-param'));
        swalParams.forEach(param => {
          showWarningsForAttributes(param, ['name', 'value']);
          const paramName = param.getAttribute('name');
          const value = param.getAttribute('value');

          if (typeof defaultParams[paramName] === 'boolean' && value === 'false') {
            result[paramName] = false;
          }

          if (typeof defaultParams[paramName] === 'object') {
            result[paramName] = JSON.parse(value);
          }
        });
        return result;
      };
      /**
       * @param {DocumentFragment} templateContent
       */


      const getSwalButtons = templateContent => {
        const result = {};
        /** @type {HTMLElement[]} */

        const swalButtons = Array.from(templateContent.querySelectorAll('swal-button'));
        swalButtons.forEach(button => {
          showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
          const type = button.getAttribute('type');
          result["".concat(type, "ButtonText")] = button.innerHTML;
          result["show".concat(capitalizeFirstLetter(type), "Button")] = true;

          if (button.hasAttribute('color')) {
            result["".concat(type, "ButtonColor")] = button.getAttribute('color');
          }

          if (button.hasAttribute('aria-label')) {
            result["".concat(type, "ButtonAriaLabel")] = button.getAttribute('aria-label');
          }
        });
        return result;
      };
      /**
       * @param {DocumentFragment} templateContent
       */


      const getSwalImage = templateContent => {
        const result = {};
        /** @type {HTMLElement} */

        const image = templateContent.querySelector('swal-image');

        if (image) {
          showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);

          if (image.hasAttribute('src')) {
            result.imageUrl = image.getAttribute('src');
          }

          if (image.hasAttribute('width')) {
            result.imageWidth = image.getAttribute('width');
          }

          if (image.hasAttribute('height')) {
            result.imageHeight = image.getAttribute('height');
          }

          if (image.hasAttribute('alt')) {
            result.imageAlt = image.getAttribute('alt');
          }
        }

        return result;
      };
      /**
       * @param {DocumentFragment} templateContent
       */


      const getSwalIcon = templateContent => {
        const result = {};
        /** @type {HTMLElement} */

        const icon = templateContent.querySelector('swal-icon');

        if (icon) {
          showWarningsForAttributes(icon, ['type', 'color']);

          if (icon.hasAttribute('type')) {
            result.icon = icon.getAttribute('type');
          }

          if (icon.hasAttribute('color')) {
            result.iconColor = icon.getAttribute('color');
          }

          result.iconHtml = icon.innerHTML;
        }

        return result;
      };
      /**
       * @param {DocumentFragment} templateContent
       */


      const getSwalInput = templateContent => {
        const result = {};
        /** @type {HTMLElement} */

        const input = templateContent.querySelector('swal-input');

        if (input) {
          showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
          result.input = input.getAttribute('type') || 'text';

          if (input.hasAttribute('label')) {
            result.inputLabel = input.getAttribute('label');
          }

          if (input.hasAttribute('placeholder')) {
            result.inputPlaceholder = input.getAttribute('placeholder');
          }

          if (input.hasAttribute('value')) {
            result.inputValue = input.getAttribute('value');
          }
        }
        /** @type {HTMLElement[]} */


        const inputOptions = Array.from(templateContent.querySelectorAll('swal-input-option'));

        if (inputOptions.length) {
          result.inputOptions = {};
          inputOptions.forEach(option => {
            showWarningsForAttributes(option, ['value']);
            const optionValue = option.getAttribute('value');
            const optionName = option.innerHTML;
            result.inputOptions[optionValue] = optionName;
          });
        }

        return result;
      };
      /**
       * @param {DocumentFragment} templateContent
       * @param {string[]} paramNames
       */


      const getSwalStringParams = (templateContent, paramNames) => {
        const result = {};

        for (const i in paramNames) {
          const paramName = paramNames[i];
          /** @type {HTMLElement} */

          const tag = templateContent.querySelector(paramName);

          if (tag) {
            showWarningsForAttributes(tag, []);
            result[paramName.replace(/^swal-/, '')] = tag.innerHTML.trim();
          }
        }

        return result;
      };
      /**
       * @param {DocumentFragment} templateContent
       */


      const showWarningsForElements = templateContent => {
        const allowedElements = swalStringParams.concat(['swal-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
        Array.from(templateContent.children).forEach(el => {
          const tagName = el.tagName.toLowerCase();

          if (allowedElements.indexOf(tagName) === -1) {
            warn("Unrecognized element <".concat(tagName, ">"));
          }
        });
      };
      /**
       * @param {HTMLElement} el
       * @param {string[]} allowedAttributes
       */


      const showWarningsForAttributes = (el, allowedAttributes) => {
        Array.from(el.attributes).forEach(attribute => {
          if (allowedAttributes.indexOf(attribute.name) === -1) {
            warn(["Unrecognized attribute \"".concat(attribute.name, "\" on <").concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(', ')) : 'To set the value, use HTML within the element.')]);
          }
        });
      };

      var defaultInputValidators = {
        /**
         * @param {string} string
         * @param {string} validationMessage
         * @returns {Promise<void | string>}
         */
        email: (string, validationMessage) => {
          return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
        },

        /**
         * @param {string} string
         * @param {string} validationMessage
         * @returns {Promise<void | string>}
         */
        url: (string, validationMessage) => {
          // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
          return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
        }
      };

      /**
       * @param {SweetAlertOptions} params
       */

      function setDefaultInputValidators(params) {
        // Use default `inputValidator` for supported input types if not provided
        if (!params.inputValidator) {
          Object.keys(defaultInputValidators).forEach(key => {
            if (params.input === key) {
              params.inputValidator = defaultInputValidators[key];
            }
          });
        }
      }
      /**
       * @param {SweetAlertOptions} params
       */


      function validateCustomTargetElement(params) {
        // Determine if the custom target element is valid
        if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
          warn('Target parameter is not valid, defaulting to "body"');
          params.target = 'body';
        }
      }
      /**
       * Set type, text and actions on popup
       *
       * @param {SweetAlertOptions} params
       */


      function setParameters(params) {
        setDefaultInputValidators(params); // showLoaderOnConfirm && preConfirm

        if (params.showLoaderOnConfirm && !params.preConfirm) {
          warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
        }

        validateCustomTargetElement(params); // Replace newlines with <br> in title

        if (typeof params.title === 'string') {
          params.title = params.title.split('\n').join('<br />');
        }

        init(params);
      }

      class Timer {
        constructor(callback, delay) {
          this.callback = callback;
          this.remaining = delay;
          this.running = false;
          this.start();
        }

        start() {
          if (!this.running) {
            this.running = true;
            this.started = new Date();
            this.id = setTimeout(this.callback, this.remaining);
          }

          return this.remaining;
        }

        stop() {
          if (this.running) {
            this.running = false;
            clearTimeout(this.id);
            this.remaining -= new Date().getTime() - this.started.getTime();
          }

          return this.remaining;
        }

        increase(n) {
          const running = this.running;

          if (running) {
            this.stop();
          }

          this.remaining += n;

          if (running) {
            this.start();
          }

          return this.remaining;
        }

        getTimerLeft() {
          if (this.running) {
            this.stop();
            this.start();
          }

          return this.remaining;
        }

        isRunning() {
          return this.running;
        }

      }

      const fixScrollbar = () => {
        // for queues, do not do this more than once
        if (states.previousBodyPadding !== null) {
          return;
        } // if the body has overflow


        if (document.body.scrollHeight > window.innerHeight) {
          // add padding so the content doesn't shift after removal of scrollbar
          states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
          document.body.style.paddingRight = "".concat(states.previousBodyPadding + measureScrollbar(), "px");
        }
      };
      const undoScrollbar = () => {
        if (states.previousBodyPadding !== null) {
          document.body.style.paddingRight = "".concat(states.previousBodyPadding, "px");
          states.previousBodyPadding = null;
        }
      };

      /* istanbul ignore file */

      const iOSfix = () => {
        const iOS = // @ts-ignore
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

        if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
          const offset = document.body.scrollTop;
          document.body.style.top = "".concat(offset * -1, "px");
          addClass(document.body, swalClasses.iosfix);
          lockBodyScroll();
          addBottomPaddingForTallPopups();
        }
      };
      /**
       * https://github.com/sweetalert2/sweetalert2/issues/1948
       */

      const addBottomPaddingForTallPopups = () => {
        const ua = navigator.userAgent;
        const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
        const webkit = !!ua.match(/WebKit/i);
        const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

        if (iOSSafari) {
          const bottomPanelHeight = 44;

          if (getPopup().scrollHeight > window.innerHeight - bottomPanelHeight) {
            getContainer().style.paddingBottom = "".concat(bottomPanelHeight, "px");
          }
        }
      };
      /**
       * https://github.com/sweetalert2/sweetalert2/issues/1246
       */


      const lockBodyScroll = () => {
        const container = getContainer();
        let preventTouchMove;

        container.ontouchstart = e => {
          preventTouchMove = shouldPreventTouchMove(e);
        };

        container.ontouchmove = e => {
          if (preventTouchMove) {
            e.preventDefault();
            e.stopPropagation();
          }
        };
      };

      const shouldPreventTouchMove = event => {
        const target = event.target;
        const container = getContainer();

        if (isStylus(event) || isZoom(event)) {
          return false;
        }

        if (target === container) {
          return true;
        }

        if (!isScrollable(container) && target.tagName !== 'INPUT' && // #1603
        target.tagName !== 'TEXTAREA' && // #2266
        !(isScrollable(getHtmlContainer()) && // #1944
        getHtmlContainer().contains(target))) {
          return true;
        }

        return false;
      };
      /**
       * https://github.com/sweetalert2/sweetalert2/issues/1786
       *
       * @param {*} event
       * @returns {boolean}
       */


      const isStylus = event => {
        return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
      };
      /**
       * https://github.com/sweetalert2/sweetalert2/issues/1891
       *
       * @param {TouchEvent} event
       * @returns {boolean}
       */


      const isZoom = event => {
        return event.touches && event.touches.length > 1;
      };

      const undoIOSfix = () => {
        if (hasClass(document.body, swalClasses.iosfix)) {
          const offset = parseInt(document.body.style.top, 10);
          removeClass(document.body, swalClasses.iosfix);
          document.body.style.top = '';
          document.body.scrollTop = offset * -1;
        }
      };

      const SHOW_CLASS_TIMEOUT = 10;
      /**
       * Open popup, add necessary classes and styles, fix scrollbar
       *
       * @param params
       */

      const openPopup = params => {
        const container = getContainer();
        const popup = getPopup();

        if (typeof params.willOpen === 'function') {
          params.willOpen(popup);
        }

        const bodyStyles = window.getComputedStyle(document.body);
        const initialBodyOverflow = bodyStyles.overflowY;
        addClasses$1(container, popup, params); // scrolling is 'hidden' until animation is done, after that 'auto'

        setTimeout(() => {
          setScrollingVisibility(container, popup);
        }, SHOW_CLASS_TIMEOUT);

        if (isModal()) {
          fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
          setAriaHidden();
        }

        if (!isToast() && !globalState.previousActiveElement) {
          globalState.previousActiveElement = document.activeElement;
        }

        if (typeof params.didOpen === 'function') {
          setTimeout(() => params.didOpen(popup));
        }

        removeClass(container, swalClasses['no-transition']);
      };

      const swalOpenAnimationFinished = event => {
        const popup = getPopup();

        if (event.target !== popup) {
          return;
        }

        const container = getContainer();
        popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
        container.style.overflowY = 'auto';
      };

      const setScrollingVisibility = (container, popup) => {
        if (animationEndEvent && hasCssAnimation(popup)) {
          container.style.overflowY = 'hidden';
          popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
        } else {
          container.style.overflowY = 'auto';
        }
      };

      const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
        iOSfix();

        if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
          fixScrollbar();
        } // sweetalert2/issues/1247


        setTimeout(() => {
          container.scrollTop = 0;
        });
      };

      const addClasses$1 = (container, popup, params) => {
        addClass(container, params.showClass.backdrop); // this workaround with opacity is needed for https://github.com/sweetalert2/sweetalert2/issues/2059

        popup.style.setProperty('opacity', '0', 'important');
        show(popup, 'grid');
        setTimeout(() => {
          // Animate popup right after showing it
          addClass(popup, params.showClass.popup); // and remove the opacity workaround

          popup.style.removeProperty('opacity');
        }, SHOW_CLASS_TIMEOUT); // 10ms in order to fix #2062

        addClass([document.documentElement, document.body], swalClasses.shown);

        if (params.heightAuto && params.backdrop && !params.toast) {
          addClass([document.documentElement, document.body], swalClasses['height-auto']);
        }
      };

      /**
       * Shows loader (spinner), this is useful with AJAX requests.
       * By default the loader be shown instead of the "Confirm" button.
       */

      const showLoading = buttonToReplace => {
        let popup = getPopup();

        if (!popup) {
          new Swal(); // eslint-disable-line no-new
        }

        popup = getPopup();
        const loader = getLoader();

        if (isToast()) {
          hide(getIcon());
        } else {
          replaceButton(popup, buttonToReplace);
        }

        show(loader);
        popup.setAttribute('data-loading', 'true');
        popup.setAttribute('aria-busy', 'true');
        popup.focus();
      };

      const replaceButton = (popup, buttonToReplace) => {
        const actions = getActions();
        const loader = getLoader();

        if (!buttonToReplace && isVisible(getConfirmButton())) {
          buttonToReplace = getConfirmButton();
        }

        show(actions);

        if (buttonToReplace) {
          hide(buttonToReplace);
          loader.setAttribute('data-button-to-replace', buttonToReplace.className);
        }

        loader.parentNode.insertBefore(loader, buttonToReplace);
        addClass([popup, actions], swalClasses.loading);
      };

      const handleInputOptionsAndValue = (instance, params) => {
        if (params.input === 'select' || params.input === 'radio') {
          handleInputOptions(instance, params);
        } else if (['text', 'email', 'number', 'tel', 'textarea'].includes(params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
          showLoading(getConfirmButton());
          handleInputValue(instance, params);
        }
      };
      const getInputValue = (instance, innerParams) => {
        const input = instance.getInput();

        if (!input) {
          return null;
        }

        switch (innerParams.input) {
          case 'checkbox':
            return getCheckboxValue(input);

          case 'radio':
            return getRadioValue(input);

          case 'file':
            return getFileValue(input);

          default:
            return innerParams.inputAutoTrim ? input.value.trim() : input.value;
        }
      };

      const getCheckboxValue = input => input.checked ? 1 : 0;

      const getRadioValue = input => input.checked ? input.value : null;

      const getFileValue = input => input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;

      const handleInputOptions = (instance, params) => {
        const popup = getPopup();

        const processInputOptions = inputOptions => populateInputOptions[params.input](popup, formatInputOptions(inputOptions), params);

        if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
          showLoading(getConfirmButton());
          asPromise(params.inputOptions).then(inputOptions => {
            instance.hideLoading();
            processInputOptions(inputOptions);
          });
        } else if (typeof params.inputOptions === 'object') {
          processInputOptions(params.inputOptions);
        } else {
          error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(typeof params.inputOptions));
        }
      };

      const handleInputValue = (instance, params) => {
        const input = instance.getInput();
        hide(input);
        asPromise(params.inputValue).then(inputValue => {
          input.value = params.input === 'number' ? parseFloat(inputValue) || 0 : "".concat(inputValue);
          show(input);
          input.focus();
          instance.hideLoading();
        }).catch(err => {
          error("Error in inputValue promise: ".concat(err));
          input.value = '';
          show(input);
          input.focus();
          instance.hideLoading();
        });
      };

      const populateInputOptions = {
        select: (popup, inputOptions, params) => {
          const select = getDirectChildByClass(popup, swalClasses.select);

          const renderOption = (parent, optionLabel, optionValue) => {
            const option = document.createElement('option');
            option.value = optionValue;
            setInnerHtml(option, optionLabel);
            option.selected = isSelected(optionValue, params.inputValue);
            parent.appendChild(option);
          };

          inputOptions.forEach(inputOption => {
            const optionValue = inputOption[0];
            const optionLabel = inputOption[1]; // <optgroup> spec:
            // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
            // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
            // check whether this is a <optgroup>

            if (Array.isArray(optionLabel)) {
              // if it is an array, then it is an <optgroup>
              const optgroup = document.createElement('optgroup');
              optgroup.label = optionValue;
              optgroup.disabled = false; // not configurable for now

              select.appendChild(optgroup);
              optionLabel.forEach(o => renderOption(optgroup, o[1], o[0]));
            } else {
              // case of <option>
              renderOption(select, optionLabel, optionValue);
            }
          });
          select.focus();
        },
        radio: (popup, inputOptions, params) => {
          const radio = getDirectChildByClass(popup, swalClasses.radio);
          inputOptions.forEach(inputOption => {
            const radioValue = inputOption[0];
            const radioLabel = inputOption[1];
            const radioInput = document.createElement('input');
            const radioLabelElement = document.createElement('label');
            radioInput.type = 'radio';
            radioInput.name = swalClasses.radio;
            radioInput.value = radioValue;

            if (isSelected(radioValue, params.inputValue)) {
              radioInput.checked = true;
            }

            const label = document.createElement('span');
            setInnerHtml(label, radioLabel);
            label.className = swalClasses.label;
            radioLabelElement.appendChild(radioInput);
            radioLabelElement.appendChild(label);
            radio.appendChild(radioLabelElement);
          });
          const radios = radio.querySelectorAll('input');

          if (radios.length) {
            radios[0].focus();
          }
        }
      };
      /**
       * Converts `inputOptions` into an array of `[value, label]`s
       * @param inputOptions
       */

      const formatInputOptions = inputOptions => {
        const result = [];

        if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
          inputOptions.forEach((value, key) => {
            let valueFormatted = value;

            if (typeof valueFormatted === 'object') {
              // case of <optgroup>
              valueFormatted = formatInputOptions(valueFormatted);
            }

            result.push([key, valueFormatted]);
          });
        } else {
          Object.keys(inputOptions).forEach(key => {
            let valueFormatted = inputOptions[key];

            if (typeof valueFormatted === 'object') {
              // case of <optgroup>
              valueFormatted = formatInputOptions(valueFormatted);
            }

            result.push([key, valueFormatted]);
          });
        }

        return result;
      };

      const isSelected = (optionValue, inputValue) => {
        return inputValue && inputValue.toString() === optionValue.toString();
      };

      /**
       * Hides loader and shows back the button which was hidden by .showLoading()
       */

      function hideLoading() {
        // do nothing if popup is closed
        const innerParams = privateProps.innerParams.get(this);

        if (!innerParams) {
          return;
        }

        const domCache = privateProps.domCache.get(this);
        hide(domCache.loader);

        if (isToast()) {
          if (innerParams.icon) {
            show(getIcon());
          }
        } else {
          showRelatedButton(domCache);
        }

        removeClass([domCache.popup, domCache.actions], swalClasses.loading);
        domCache.popup.removeAttribute('aria-busy');
        domCache.popup.removeAttribute('data-loading');
        domCache.confirmButton.disabled = false;
        domCache.denyButton.disabled = false;
        domCache.cancelButton.disabled = false;
      }

      const showRelatedButton = domCache => {
        const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));

        if (buttonToReplace.length) {
          show(buttonToReplace[0], 'inline-block');
        } else if (allButtonsAreHidden()) {
          hide(domCache.actions);
        }
      };

      /**
       * Gets the input DOM node, this method works with input parameter.
       * @returns {HTMLElement | null}
       */

      function getInput$1(instance) {
        const innerParams = privateProps.innerParams.get(instance || this);
        const domCache = privateProps.domCache.get(instance || this);

        if (!domCache) {
          return null;
        }

        return getInput(domCache.popup, innerParams.input);
      }

      /**
       * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
       * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
       * This is the approach that Babel will probably take to implement private methods/fields
       *   https://github.com/tc39/proposal-private-methods
       *   https://github.com/babel/babel/pull/7555
       * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
       *   then we can use that language feature.
       */
      var privateMethods = {
        swalPromiseResolve: new WeakMap(),
        swalPromiseReject: new WeakMap()
      };

      /*
       * Global function to determine if SweetAlert2 popup is shown
       */

      const isVisible$1 = () => {
        return isVisible(getPopup());
      };
      /*
       * Global function to click 'Confirm' button
       */

      const clickConfirm = () => getConfirmButton() && getConfirmButton().click();
      /*
       * Global function to click 'Deny' button
       */

      const clickDeny = () => getDenyButton() && getDenyButton().click();
      /*
       * Global function to click 'Cancel' button
       */

      const clickCancel = () => getCancelButton() && getCancelButton().click();

      /**
       * @param {GlobalState} globalState
       */

      const removeKeydownHandler = globalState => {
        if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
          globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
            capture: globalState.keydownListenerCapture
          });
          globalState.keydownHandlerAdded = false;
        }
      };
      /**
       * @param {SweetAlert2} instance
       * @param {GlobalState} globalState
       * @param {SweetAlertOptions} innerParams
       * @param {*} dismissWith
       */

      const addKeydownHandler = (instance, globalState, innerParams, dismissWith) => {
        removeKeydownHandler(globalState);

        if (!innerParams.toast) {
          globalState.keydownHandler = e => keydownHandler(instance, e, dismissWith);

          globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
          globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
          globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
            capture: globalState.keydownListenerCapture
          });
          globalState.keydownHandlerAdded = true;
        }
      };
      /**
       * @param {SweetAlertOptions} innerParams
       * @param {number} index
       * @param {number} increment
       */

      const setFocus = (innerParams, index, increment) => {
        const focusableElements = getFocusableElements(); // search for visible elements and select the next possible match

        if (focusableElements.length) {
          index = index + increment; // rollover to first item

          if (index === focusableElements.length) {
            index = 0; // go to last item
          } else if (index === -1) {
            index = focusableElements.length - 1;
          }

          return focusableElements[index].focus();
        } // no visible focusable elements, focus the popup


        getPopup().focus();
      };
      const arrowKeysNextButton = ['ArrowRight', 'ArrowDown'];
      const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp'];
      /**
       * @param {SweetAlert2} instance
       * @param {KeyboardEvent} e
       * @param {function} dismissWith
       */

      const keydownHandler = (instance, e, dismissWith) => {
        const innerParams = privateProps.innerParams.get(instance);

        if (!innerParams) {
          return; // This instance has already been destroyed
        } // Ignore keydown during IME composition
        // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
        // https://github.com/sweetalert2/sweetalert2/issues/720
        // https://github.com/sweetalert2/sweetalert2/issues/2406


        if (e.isComposing || e.keyCode === 229) {
          return;
        }

        if (innerParams.stopKeydownPropagation) {
          e.stopPropagation();
        } // ENTER


        if (e.key === 'Enter') {
          handleEnter(instance, e, innerParams);
        } // TAB
        else if (e.key === 'Tab') {
          handleTab(e, innerParams);
        } // ARROWS - switch focus between buttons
        else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(e.key)) {
          handleArrows(e.key);
        } // ESC
        else if (e.key === 'Escape') {
          handleEsc(e, innerParams, dismissWith);
        }
      };
      /**
       * @param {SweetAlert2} instance
       * @param {KeyboardEvent} e
       * @param {SweetAlertOptions} innerParams
       */


      const handleEnter = (instance, e, innerParams) => {
        // https://github.com/sweetalert2/sweetalert2/issues/2386
        if (!callIfFunction(innerParams.allowEnterKey)) {
          return;
        }

        if (e.target && instance.getInput() && e.target instanceof HTMLElement && e.target.outerHTML === instance.getInput().outerHTML) {
          if (['textarea', 'file'].includes(innerParams.input)) {
            return; // do not submit
          }

          clickConfirm();
          e.preventDefault();
        }
      };
      /**
       * @param {KeyboardEvent} e
       * @param {SweetAlertOptions} innerParams
       */


      const handleTab = (e, innerParams) => {
        const targetElement = e.target;
        const focusableElements = getFocusableElements();
        let btnIndex = -1;

        for (let i = 0; i < focusableElements.length; i++) {
          if (targetElement === focusableElements[i]) {
            btnIndex = i;
            break;
          }
        } // Cycle to the next button


        if (!e.shiftKey) {
          setFocus(innerParams, btnIndex, 1);
        } // Cycle to the prev button
        else {
          setFocus(innerParams, btnIndex, -1);
        }

        e.stopPropagation();
        e.preventDefault();
      };
      /**
       * @param {string} key
       */


      const handleArrows = key => {
        const confirmButton = getConfirmButton();
        const denyButton = getDenyButton();
        const cancelButton = getCancelButton();

        if (document.activeElement instanceof HTMLElement && ![confirmButton, denyButton, cancelButton].includes(document.activeElement)) {
          return;
        }

        const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling';
        let buttonToFocus = document.activeElement;

        for (let i = 0; i < getActions().children.length; i++) {
          buttonToFocus = buttonToFocus[sibling];

          if (!buttonToFocus) {
            return;
          }

          if (buttonToFocus instanceof HTMLButtonElement && isVisible(buttonToFocus)) {
            break;
          }
        }

        if (buttonToFocus instanceof HTMLButtonElement) {
          buttonToFocus.focus();
        }
      };
      /**
       * @param {KeyboardEvent} e
       * @param {SweetAlertOptions} innerParams
       * @param {function} dismissWith
       */


      const handleEsc = (e, innerParams, dismissWith) => {
        if (callIfFunction(innerParams.allowEscapeKey)) {
          e.preventDefault();
          dismissWith(DismissReason.esc);
        }
      };

      /*
       * Instance method to close sweetAlert
       */

      function removePopupAndResetState(instance, container, returnFocus, didClose) {
        if (isToast()) {
          triggerDidCloseAndDispose(instance, didClose);
        } else {
          restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
          removeKeydownHandler(globalState);
        }

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); // workaround for #2088
        // for some reason removing the container in Safari will scroll the document to bottom

        if (isSafari) {
          container.setAttribute('style', 'display:none !important');
          container.removeAttribute('class');
          container.innerHTML = '';
        } else {
          container.remove();
        }

        if (isModal()) {
          undoScrollbar();
          undoIOSfix();
          unsetAriaHidden();
        }

        removeBodyClasses();
      }

      function removeBodyClasses() {
        removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown']]);
      }

      function close(resolveValue) {
        resolveValue = prepareResolveValue(resolveValue);
        const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
        const didClose = triggerClosePopup(this);

        if (this.isAwaitingPromise()) {
          // A swal awaiting for a promise (after a click on Confirm or Deny) cannot be dismissed anymore #2335
          if (!resolveValue.isDismissed) {
            handleAwaitingPromise(this);
            swalPromiseResolve(resolveValue);
          }
        } else if (didClose) {
          // Resolve Swal promise
          swalPromiseResolve(resolveValue);
        }
      }
      function isAwaitingPromise() {
        return !!privateProps.awaitingPromise.get(this);
      }

      const triggerClosePopup = instance => {
        const popup = getPopup();

        if (!popup) {
          return false;
        }

        const innerParams = privateProps.innerParams.get(instance);

        if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
          return false;
        }

        removeClass(popup, innerParams.showClass.popup);
        addClass(popup, innerParams.hideClass.popup);
        const backdrop = getContainer();
        removeClass(backdrop, innerParams.showClass.backdrop);
        addClass(backdrop, innerParams.hideClass.backdrop);
        handlePopupAnimation(instance, popup, innerParams);
        return true;
      };

      function rejectPromise(error) {
        const rejectPromise = privateMethods.swalPromiseReject.get(this);
        handleAwaitingPromise(this);

        if (rejectPromise) {
          // Reject Swal promise
          rejectPromise(error);
        }
      }
      const handleAwaitingPromise = instance => {
        if (instance.isAwaitingPromise()) {
          privateProps.awaitingPromise.delete(instance); // The instance might have been previously partly destroyed, we must resume the destroy process in this case #2335

          if (!privateProps.innerParams.get(instance)) {
            instance._destroy();
          }
        }
      };

      const prepareResolveValue = resolveValue => {
        // When user calls Swal.close()
        if (typeof resolveValue === 'undefined') {
          return {
            isConfirmed: false,
            isDenied: false,
            isDismissed: true
          };
        }

        return Object.assign({
          isConfirmed: false,
          isDenied: false,
          isDismissed: false
        }, resolveValue);
      };

      const handlePopupAnimation = (instance, popup, innerParams) => {
        const container = getContainer(); // If animation is supported, animate

        const animationIsSupported = animationEndEvent && hasCssAnimation(popup);

        if (typeof innerParams.willClose === 'function') {
          innerParams.willClose(popup);
        }

        if (animationIsSupported) {
          animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
        } else {
          // Otherwise, remove immediately
          removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
        }
      };

      const animatePopup = (instance, popup, container, returnFocus, didClose) => {
        globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
        popup.addEventListener(animationEndEvent, function (e) {
          if (e.target === popup) {
            globalState.swalCloseEventFinishedCallback();
            delete globalState.swalCloseEventFinishedCallback;
          }
        });
      };

      const triggerDidCloseAndDispose = (instance, didClose) => {
        setTimeout(() => {
          if (typeof didClose === 'function') {
            didClose.bind(instance.params)();
          }

          instance._destroy();
        });
      };

      function setButtonsDisabled(instance, buttons, disabled) {
        const domCache = privateProps.domCache.get(instance);
        buttons.forEach(button => {
          domCache[button].disabled = disabled;
        });
      }

      function setInputDisabled(input, disabled) {
        if (!input) {
          return false;
        }

        if (input.type === 'radio') {
          const radiosContainer = input.parentNode.parentNode;
          const radios = radiosContainer.querySelectorAll('input');

          for (let i = 0; i < radios.length; i++) {
            radios[i].disabled = disabled;
          }
        } else {
          input.disabled = disabled;
        }
      }

      function enableButtons() {
        setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
      }
      function disableButtons() {
        setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
      }
      function enableInput() {
        return setInputDisabled(this.getInput(), false);
      }
      function disableInput() {
        return setInputDisabled(this.getInput(), true);
      }

      function showValidationMessage(error) {
        const domCache = privateProps.domCache.get(this);
        const params = privateProps.innerParams.get(this);
        setInnerHtml(domCache.validationMessage, error);
        domCache.validationMessage.className = swalClasses['validation-message'];

        if (params.customClass && params.customClass.validationMessage) {
          addClass(domCache.validationMessage, params.customClass.validationMessage);
        }

        show(domCache.validationMessage);
        const input = this.getInput();

        if (input) {
          input.setAttribute('aria-invalid', true);
          input.setAttribute('aria-describedby', swalClasses['validation-message']);
          focusInput(input);
          addClass(input, swalClasses.inputerror);
        }
      } // Hide block with validation message

      function resetValidationMessage$1() {
        const domCache = privateProps.domCache.get(this);

        if (domCache.validationMessage) {
          hide(domCache.validationMessage);
        }

        const input = this.getInput();

        if (input) {
          input.removeAttribute('aria-invalid');
          input.removeAttribute('aria-describedby');
          removeClass(input, swalClasses.inputerror);
        }
      }

      function getProgressSteps$1() {
        const domCache = privateProps.domCache.get(this);
        return domCache.progressSteps;
      }

      /**
       * Updates popup parameters.
       */

      function update(params) {
        const popup = getPopup();
        const innerParams = privateProps.innerParams.get(this);

        if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
          return warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
        }

        const validUpdatableParams = filterValidParams(params);
        const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
        render(this, updatedParams);
        privateProps.innerParams.set(this, updatedParams);
        Object.defineProperties(this, {
          params: {
            value: Object.assign({}, this.params, params),
            writable: false,
            enumerable: true
          }
        });
      }

      const filterValidParams = params => {
        const validUpdatableParams = {};
        Object.keys(params).forEach(param => {
          if (isUpdatableParameter(param)) {
            validUpdatableParams[param] = params[param];
          } else {
            warn("Invalid parameter to update: ".concat(param));
          }
        });
        return validUpdatableParams;
      };

      function _destroy() {
        const domCache = privateProps.domCache.get(this);
        const innerParams = privateProps.innerParams.get(this);

        if (!innerParams) {
          disposeWeakMaps(this); // The WeakMaps might have been partly destroyed, we must recall it to dispose any remaining WeakMaps #2335

          return; // This instance has already been destroyed
        } // Check if there is another Swal closing


        if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
          globalState.swalCloseEventFinishedCallback();
          delete globalState.swalCloseEventFinishedCallback;
        }

        if (typeof innerParams.didDestroy === 'function') {
          innerParams.didDestroy();
        }

        disposeSwal(this);
      }
      /**
       * @param {SweetAlert2} instance
       */

      const disposeSwal = instance => {
        disposeWeakMaps(instance); // Unset this.params so GC will dispose it (#1569)
        // @ts-ignore

        delete instance.params; // Unset globalState props so GC will dispose globalState (#1569)

        delete globalState.keydownHandler;
        delete globalState.keydownTarget; // Unset currentInstance

        delete globalState.currentInstance;
      };
      /**
       * @param {SweetAlert2} instance
       */


      const disposeWeakMaps = instance => {
        // If the current instance is awaiting a promise result, we keep the privateMethods to call them once the promise result is retrieved #2335
        // @ts-ignore
        if (instance.isAwaitingPromise()) {
          unsetWeakMaps(privateProps, instance);
          privateProps.awaitingPromise.set(instance, true);
        } else {
          unsetWeakMaps(privateMethods, instance);
          unsetWeakMaps(privateProps, instance);
        }
      };
      /**
       * @param {object} obj
       * @param {SweetAlert2} instance
       */


      const unsetWeakMaps = (obj, instance) => {
        for (const i in obj) {
          obj[i].delete(instance);
        }
      };



      var instanceMethods = /*#__PURE__*/Object.freeze({
        hideLoading: hideLoading,
        disableLoading: hideLoading,
        getInput: getInput$1,
        close: close,
        isAwaitingPromise: isAwaitingPromise,
        rejectPromise: rejectPromise,
        handleAwaitingPromise: handleAwaitingPromise,
        closePopup: close,
        closeModal: close,
        closeToast: close,
        enableButtons: enableButtons,
        disableButtons: disableButtons,
        enableInput: enableInput,
        disableInput: disableInput,
        showValidationMessage: showValidationMessage,
        resetValidationMessage: resetValidationMessage$1,
        getProgressSteps: getProgressSteps$1,
        update: update,
        _destroy: _destroy
      });

      /**
       * @param {SweetAlert2} instance
       */

      const handleConfirmButtonClick = instance => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();

        if (innerParams.input) {
          handleConfirmOrDenyWithInput(instance, 'confirm');
        } else {
          confirm(instance, true);
        }
      };
      /**
       * @param {SweetAlert2} instance
       */

      const handleDenyButtonClick = instance => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();

        if (innerParams.returnInputValueOnDeny) {
          handleConfirmOrDenyWithInput(instance, 'deny');
        } else {
          deny(instance, false);
        }
      };
      /**
       * @param {SweetAlert2} instance
       * @param {Function} dismissWith
       */

      const handleCancelButtonClick = (instance, dismissWith) => {
        instance.disableButtons();
        dismissWith(DismissReason.cancel);
      };
      /**
       * @param {SweetAlert2} instance
       * @param {'confirm' | 'deny'} type
       */

      const handleConfirmOrDenyWithInput = (instance, type) => {
        const innerParams = privateProps.innerParams.get(instance);

        if (!innerParams.input) {
          error("The \"input\" parameter is needed to be set when using returnInputValueOn".concat(capitalizeFirstLetter(type)));
          return;
        }

        const inputValue = getInputValue(instance, innerParams);

        if (innerParams.inputValidator) {
          handleInputValidator(instance, inputValue, type);
        } else if (!instance.getInput().checkValidity()) {
          instance.enableButtons();
          instance.showValidationMessage(innerParams.validationMessage);
        } else if (type === 'deny') {
          deny(instance, inputValue);
        } else {
          confirm(instance, inputValue);
        }
      };
      /**
       * @param {SweetAlert2} instance
       * @param {string} inputValue
       * @param {'confirm' | 'deny'} type
       */


      const handleInputValidator = (instance, inputValue, type) => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableInput();
        const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
        validationPromise.then(validationMessage => {
          instance.enableButtons();
          instance.enableInput();

          if (validationMessage) {
            instance.showValidationMessage(validationMessage);
          } else if (type === 'deny') {
            deny(instance, inputValue);
          } else {
            confirm(instance, inputValue);
          }
        });
      };
      /**
       * @param {SweetAlert2} instance
       * @param {any} value
       */


      const deny = (instance, value) => {
        const innerParams = privateProps.innerParams.get(instance || undefined);

        if (innerParams.showLoaderOnDeny) {
          showLoading(getDenyButton());
        }

        if (innerParams.preDeny) {
          privateProps.awaitingPromise.set(instance || undefined, true); // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preDeny's promise is received

          const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
          preDenyPromise.then(preDenyValue => {
            if (preDenyValue === false) {
              instance.hideLoading();
              handleAwaitingPromise(instance);
            } else {
              instance.close({
                isDenied: true,
                value: typeof preDenyValue === 'undefined' ? value : preDenyValue
              });
            }
          }).catch(error$$1 => rejectWith(instance || undefined, error$$1));
        } else {
          instance.close({
            isDenied: true,
            value
          });
        }
      };
      /**
       * @param {SweetAlert2} instance
       * @param {any} value
       */


      const succeedWith = (instance, value) => {
        instance.close({
          isConfirmed: true,
          value
        });
      };
      /**
       *
       * @param {SweetAlert2} instance
       * @param {string} error
       */


      const rejectWith = (instance, error$$1) => {
        // @ts-ignore
        instance.rejectPromise(error$$1);
      };
      /**
       *
       * @param {SweetAlert2} instance
       * @param {any} value
       */


      const confirm = (instance, value) => {
        const innerParams = privateProps.innerParams.get(instance || undefined);

        if (innerParams.showLoaderOnConfirm) {
          showLoading();
        }

        if (innerParams.preConfirm) {
          instance.resetValidationMessage();
          privateProps.awaitingPromise.set(instance || undefined, true); // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preConfirm's promise is received

          const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
          preConfirmPromise.then(preConfirmValue => {
            if (isVisible(getValidationMessage()) || preConfirmValue === false) {
              instance.hideLoading();
              handleAwaitingPromise(instance);
            } else {
              succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
            }
          }).catch(error$$1 => rejectWith(instance || undefined, error$$1));
        } else {
          succeedWith(instance, value);
        }
      };

      const handlePopupClick = (instance, domCache, dismissWith) => {
        const innerParams = privateProps.innerParams.get(instance);

        if (innerParams.toast) {
          handleToastClick(instance, domCache, dismissWith);
        } else {
          // Ignore click events that had mousedown on the popup but mouseup on the container
          // This can happen when the user drags a slider
          handleModalMousedown(domCache); // Ignore click events that had mousedown on the container but mouseup on the popup

          handleContainerMousedown(domCache);
          handleModalClick(instance, domCache, dismissWith);
        }
      };

      const handleToastClick = (instance, domCache, dismissWith) => {
        // Closing toast by internal click
        domCache.popup.onclick = () => {
          const innerParams = privateProps.innerParams.get(instance);

          if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
            return;
          }

          dismissWith(DismissReason.close);
        };
      };
      /**
       * @param {*} innerParams
       * @returns {boolean}
       */


      const isAnyButtonShown = innerParams => {
        return innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton;
      };

      let ignoreOutsideClick = false;

      const handleModalMousedown = domCache => {
        domCache.popup.onmousedown = () => {
          domCache.container.onmouseup = function (e) {
            domCache.container.onmouseup = undefined; // We only check if the mouseup target is the container because usually it doesn't
            // have any other direct children aside of the popup

            if (e.target === domCache.container) {
              ignoreOutsideClick = true;
            }
          };
        };
      };

      const handleContainerMousedown = domCache => {
        domCache.container.onmousedown = () => {
          domCache.popup.onmouseup = function (e) {
            domCache.popup.onmouseup = undefined; // We also need to check if the mouseup target is a child of the popup

            if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
              ignoreOutsideClick = true;
            }
          };
        };
      };

      const handleModalClick = (instance, domCache, dismissWith) => {
        domCache.container.onclick = e => {
          const innerParams = privateProps.innerParams.get(instance);

          if (ignoreOutsideClick) {
            ignoreOutsideClick = false;
            return;
          }

          if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
            dismissWith(DismissReason.backdrop);
          }
        };
      };

      const isJqueryElement = elem => typeof elem === 'object' && elem.jquery;

      const isElement = elem => elem instanceof Element || isJqueryElement(elem);

      const argsToParams = args => {
        const params = {};

        if (typeof args[0] === 'object' && !isElement(args[0])) {
          Object.assign(params, args[0]);
        } else {
          ['title', 'html', 'icon'].forEach((name, index) => {
            const arg = args[index];

            if (typeof arg === 'string' || isElement(arg)) {
              params[name] = arg;
            } else if (arg !== undefined) {
              error("Unexpected type of ".concat(name, "! Expected \"string\" or \"Element\", got ").concat(typeof arg));
            }
          });
        }

        return params;
      };

      function fire() {
        const Swal = this; // eslint-disable-line @typescript-eslint/no-this-alias

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return new Swal(...args);
      }

      /**
       * Returns an extended version of `Swal` containing `params` as defaults.
       * Useful for reusing Swal configuration.
       *
       * For example:
       *
       * Before:
       * const textPromptOptions = { input: 'text', showCancelButton: true }
       * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
       * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
       *
       * After:
       * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
       * const {value: firstName} = await TextPrompt('What is your first name?')
       * const {value: lastName} = await TextPrompt('What is your last name?')
       *
       * @param mixinParams
       */
      function mixin(mixinParams) {
        class MixinSwal extends this {
          _main(params, priorityMixinParams) {
            return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
          }

        }

        return MixinSwal;
      }

      /**
       * If `timer` parameter is set, returns number of milliseconds of timer remained.
       * Otherwise, returns undefined.
       */

      const getTimerLeft = () => {
        return globalState.timeout && globalState.timeout.getTimerLeft();
      };
      /**
       * Stop timer. Returns number of milliseconds of timer remained.
       * If `timer` parameter isn't set, returns undefined.
       */

      const stopTimer = () => {
        if (globalState.timeout) {
          stopTimerProgressBar();
          return globalState.timeout.stop();
        }
      };
      /**
       * Resume timer. Returns number of milliseconds of timer remained.
       * If `timer` parameter isn't set, returns undefined.
       */

      const resumeTimer = () => {
        if (globalState.timeout) {
          const remaining = globalState.timeout.start();
          animateTimerProgressBar(remaining);
          return remaining;
        }
      };
      /**
       * Resume timer. Returns number of milliseconds of timer remained.
       * If `timer` parameter isn't set, returns undefined.
       */

      const toggleTimer = () => {
        const timer = globalState.timeout;
        return timer && (timer.running ? stopTimer() : resumeTimer());
      };
      /**
       * Increase timer. Returns number of milliseconds of an updated timer.
       * If `timer` parameter isn't set, returns undefined.
       */

      const increaseTimer = n => {
        if (globalState.timeout) {
          const remaining = globalState.timeout.increase(n);
          animateTimerProgressBar(remaining, true);
          return remaining;
        }
      };
      /**
       * Check if timer is running. Returns true if timer is running
       * or false if timer is paused or stopped.
       * If `timer` parameter isn't set, returns undefined
       */

      const isTimerRunning = () => {
        return globalState.timeout && globalState.timeout.isRunning();
      };

      let bodyClickListenerAdded = false;
      const clickHandlers = {};
      function bindClickHandler() {
        let attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'data-swal-template';
        clickHandlers[attr] = this;

        if (!bodyClickListenerAdded) {
          document.body.addEventListener('click', bodyClickListener);
          bodyClickListenerAdded = true;
        }
      }

      const bodyClickListener = event => {
        for (let el = event.target; el && el !== document; el = el.parentNode) {
          for (const attr in clickHandlers) {
            const template = el.getAttribute(attr);

            if (template) {
              clickHandlers[attr].fire({
                template
              });
              return;
            }
          }
        }
      };



      var staticMethods = /*#__PURE__*/Object.freeze({
        isValidParameter: isValidParameter,
        isUpdatableParameter: isUpdatableParameter,
        isDeprecatedParameter: isDeprecatedParameter,
        argsToParams: argsToParams,
        isVisible: isVisible$1,
        clickConfirm: clickConfirm,
        clickDeny: clickDeny,
        clickCancel: clickCancel,
        getContainer: getContainer,
        getPopup: getPopup,
        getTitle: getTitle,
        getHtmlContainer: getHtmlContainer,
        getImage: getImage,
        getIcon: getIcon,
        getInputLabel: getInputLabel,
        getCloseButton: getCloseButton,
        getActions: getActions,
        getConfirmButton: getConfirmButton,
        getDenyButton: getDenyButton,
        getCancelButton: getCancelButton,
        getLoader: getLoader,
        getFooter: getFooter,
        getTimerProgressBar: getTimerProgressBar,
        getFocusableElements: getFocusableElements,
        getValidationMessage: getValidationMessage,
        isLoading: isLoading,
        fire: fire,
        mixin: mixin,
        showLoading: showLoading,
        enableLoading: showLoading,
        getTimerLeft: getTimerLeft,
        stopTimer: stopTimer,
        resumeTimer: resumeTimer,
        toggleTimer: toggleTimer,
        increaseTimer: increaseTimer,
        isTimerRunning: isTimerRunning,
        bindClickHandler: bindClickHandler
      });

      let currentInstance;

      class SweetAlert {
        constructor() {
          // Prevent run in Node env
          if (typeof window === 'undefined') {
            return;
          }

          currentInstance = this; // @ts-ignore

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          const outerParams = Object.freeze(this.constructor.argsToParams(args));
          Object.defineProperties(this, {
            params: {
              value: outerParams,
              writable: false,
              enumerable: true,
              configurable: true
            }
          }); // @ts-ignore

          const promise = currentInstance._main(currentInstance.params);

          privateProps.promise.set(this, promise);
        }

        _main(userParams) {
          let mixinParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          showWarningsForParams(Object.assign({}, mixinParams, userParams));

          if (globalState.currentInstance) {
            // @ts-ignore
            globalState.currentInstance._destroy();

            if (isModal()) {
              unsetAriaHidden();
            }
          }

          globalState.currentInstance = currentInstance;
          const innerParams = prepareParams(userParams, mixinParams);
          setParameters(innerParams);
          Object.freeze(innerParams); // clear the previous timer

          if (globalState.timeout) {
            globalState.timeout.stop();
            delete globalState.timeout;
          } // clear the restore focus timeout


          clearTimeout(globalState.restoreFocusTimeout);
          const domCache = populateDomCache(currentInstance);
          render(currentInstance, innerParams);
          privateProps.innerParams.set(currentInstance, innerParams);
          return swalPromise(currentInstance, domCache, innerParams);
        } // `catch` cannot be the name of a module export, so we define our thenable methods here instead


        then(onFulfilled) {
          const promise = privateProps.promise.get(this);
          return promise.then(onFulfilled);
        }

        finally(onFinally) {
          const promise = privateProps.promise.get(this);
          return promise.finally(onFinally);
        }

      }

      const swalPromise = (instance, domCache, innerParams) => {
        return new Promise((resolve, reject) => {
          // functions to handle all closings/dismissals
          const dismissWith = dismiss => {
            instance.closePopup({
              isDismissed: true,
              dismiss
            });
          };

          privateMethods.swalPromiseResolve.set(instance, resolve);
          privateMethods.swalPromiseReject.set(instance, reject);

          domCache.confirmButton.onclick = () => handleConfirmButtonClick(instance);

          domCache.denyButton.onclick = () => handleDenyButtonClick(instance);

          domCache.cancelButton.onclick = () => handleCancelButtonClick(instance, dismissWith);

          domCache.closeButton.onclick = () => dismissWith(DismissReason.close);

          handlePopupClick(instance, domCache, dismissWith);
          addKeydownHandler(instance, globalState, innerParams, dismissWith);
          handleInputOptionsAndValue(instance, innerParams);
          openPopup(innerParams);
          setupTimer(globalState, innerParams, dismissWith);
          initFocus(domCache, innerParams); // Scroll container to top on open (#1247, #1946)

          setTimeout(() => {
            domCache.container.scrollTop = 0;
          });
        });
      };

      const prepareParams = (userParams, mixinParams) => {
        const templateParams = getTemplateParams(userParams);
        const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams); // precedence is described in #2131

        params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
        params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
        return params;
      };
      /**
       * @param {SweetAlert2} instance
       * @returns {DomCache}
       */


      const populateDomCache = instance => {
        const domCache = {
          popup: getPopup(),
          container: getContainer(),
          actions: getActions(),
          confirmButton: getConfirmButton(),
          denyButton: getDenyButton(),
          cancelButton: getCancelButton(),
          loader: getLoader(),
          closeButton: getCloseButton(),
          validationMessage: getValidationMessage(),
          progressSteps: getProgressSteps()
        };
        privateProps.domCache.set(instance, domCache);
        return domCache;
      };
      /**
       * @param {GlobalState} globalState
       * @param {SweetAlertOptions} innerParams
       * @param {function} dismissWith
       */


      const setupTimer = (globalState$$1, innerParams, dismissWith) => {
        const timerProgressBar = getTimerProgressBar();
        hide(timerProgressBar);

        if (innerParams.timer) {
          globalState$$1.timeout = new Timer(() => {
            dismissWith('timer');
            delete globalState$$1.timeout;
          }, innerParams.timer);

          if (innerParams.timerProgressBar) {
            show(timerProgressBar);
            applyCustomClass(timerProgressBar, innerParams, 'timerProgressBar');
            setTimeout(() => {
              if (globalState$$1.timeout && globalState$$1.timeout.running) {
                // timer can be already stopped or unset at this point
                animateTimerProgressBar(innerParams.timer);
              }
            });
          }
        }
      };
      /**
       * @param {DomCache} domCache
       * @param {SweetAlertOptions} innerParams
       */


      const initFocus = (domCache, innerParams) => {
        if (innerParams.toast) {
          return;
        }

        if (!callIfFunction(innerParams.allowEnterKey)) {
          return blurActiveElement();
        }

        if (!focusButton(domCache, innerParams)) {
          setFocus(innerParams, -1, 1);
        }
      };
      /**
       * @param {DomCache} domCache
       * @param {SweetAlertOptions} innerParams
       * @returns {boolean}
       */


      const focusButton = (domCache, innerParams) => {
        if (innerParams.focusDeny && isVisible(domCache.denyButton)) {
          domCache.denyButton.focus();
          return true;
        }

        if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
          domCache.cancelButton.focus();
          return true;
        }

        if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
          domCache.confirmButton.focus();
          return true;
        }

        return false;
      };

      const blurActiveElement = () => {
        if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
      }; // This anti-war message will only be shown to Russian users visiting Russian sites


      if (typeof window !== 'undefined' && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|xn--p1ai)$/)) {
        if (Math.random() < 0.1) {
          const noWar = document.createElement('div');
          noWar.className = 'leave-russia-now-and-apply-your-skills-to-the-world';
          const video = getRandomElement([{
            text: "\u0412 \u043D\u0438\u0436\u0435\u043F\u0440\u0438\u0432\u0435\u0434\u0451\u043D\u043D\u043E\u043C \u0432\u0438\u0434\u0435\u043E \u043E\u0431\u044A\u044F\u0441\u043D\u044F\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u043A\u0430\u0436\u0434\u044B\u0439 \u0438\u0437 \u043D\u0430\u0441 \u043C\u043E\u0436\u0435\u0442 \u043F\u043E\u043C\u043E\u0447\u044C \u0432 \u0442\u043E\u043C,\n        <strong>\u0447\u0442\u043E\u0431\u044B \u044D\u0442\u0430 \u0431\u0435\u0441\u0441\u043C\u044B\u0441\u043B\u0435\u043D\u043D\u0430\u044F \u0438 \u0431\u0435\u0441\u0447\u0435\u043B\u043E\u0432\u0435\u0447\u043D\u0430\u044F \u0432\u043E\u0439\u043D\u0430 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u043B\u0430\u0441\u044C</strong>:",
            id: '4CfDhaRkw7I'
          }, {
            text: 'Эмпатия - главное <strong>человеческое</strong> чувство. Способность сопереживать. <strong>Способность поставить себя на место другого.</strong>',
            id: 's-GLAIY4DXA'
          }]);
          setInnerHtml(noWar, "\n      <div>\n        \u0415\u0441\u043B\u0438 \u043C\u044B \u043D\u0435 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u043C \u0432\u043E\u0439\u043D\u0443, \u043E\u043D\u0430 \u043F\u0440\u0438\u0434\u0435\u0442 \u0432 \u0434\u043E\u043C <strong>\u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0438\u0437 \u043D\u0430\u0441</strong> \u0438 \u0435\u0451 \u043F\u043E\u0441\u043B\u0435\u0434\u0441\u0442\u0432\u0438\u044F \u0431\u0443\u0434\u0443\u0442 <strong>\u0443\u0436\u0430\u0441\u0430\u044E\u0449\u0438\u043C\u0438</strong>.\n      </div>\n      <div>\n        \u041F\u0443\u0442\u0438\u043D\u0441\u043A\u0438\u0439 \u0440\u0435\u0436\u0438\u043C \u0437\u0430 20 \u0441 \u043B\u0438\u0448\u043D\u0438\u043C \u043B\u0435\u0442 \u0441\u0432\u043E\u0435\u0433\u043E \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u043E\u0432\u0430\u043D\u0438\u044F \u0432\u0434\u043E\u043B\u0431\u0438\u043B \u043D\u0430\u043C, \u0447\u0442\u043E \u043C\u044B \u0431\u0435\u0441\u0441\u0438\u043B\u044C\u043D\u044B \u0438 \u043E\u0434\u0438\u043D \u0447\u0435\u043B\u043E\u0432\u0435\u043A \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043D\u0438\u0447\u0435\u0433\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C. <strong>\u042D\u0442\u043E \u043D\u0435 \u0442\u0430\u043A!</strong>\n      </div>\n      <div>\n        ".concat(video.text, "\n      </div>\n      <iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/").concat(video.id, "\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n      <div>\n        \u041D\u0435\u0442 \u0432\u043E\u0439\u043D\u0435!\n      </div>\n      "));
          const closeButton = document.createElement('button');
          closeButton.innerHTML = '&times;';

          closeButton.onclick = () => noWar.remove();

          noWar.appendChild(closeButton);
          window.addEventListener('load', () => {
            setTimeout(() => {
              document.body.appendChild(noWar);
            }, 1000);
          });
        }
      } // Assign instance methods from src/instanceMethods/*.js to prototype


      Object.assign(SweetAlert.prototype, instanceMethods); // Assign static methods from src/staticMethods/*.js to constructor

      Object.assign(SweetAlert, staticMethods); // Proxy to instance methods to constructor, for now, for backwards compatibility

      Object.keys(instanceMethods).forEach(key => {
        SweetAlert[key] = function () {
          if (currentInstance) {
            return currentInstance[key](...arguments);
          }
        };
      });
      SweetAlert.DismissReason = DismissReason;
      SweetAlert.version = '11.4.24';

      const Swal = SweetAlert; // @ts-ignore

      Swal.default = Swal;

      return Swal;

    }));
    if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal.Sweetalert2){  commonjsGlobal.swal = commonjsGlobal.sweetAlert = commonjsGlobal.Swal = commonjsGlobal.SweetAlert = commonjsGlobal.Sweetalert2;}

    "undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t;}catch(e){n.innerText=t;}}(document,".swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4!important;grid-row:1/4!important;grid-template-columns:1fr 99fr 1fr;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px hsla(0deg,0%,0%,.075),0 1px 2px hsla(0deg,0%,0%,.075),1px 2px 4px hsla(0deg,0%,0%,.075),1px 3px 8px hsla(0deg,0%,0%,.075),2px 4px 16px hsla(0deg,0%,0%,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:grid;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto);grid-template-rows:minmax(min-content,auto) minmax(min-content,auto) minmax(min-content,auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-bottom-start,.swal2-container.swal2-center-start,.swal2-container.swal2-top-start{grid-template-columns:minmax(0,1fr) auto auto}.swal2-container.swal2-bottom,.swal2-container.swal2-center,.swal2-container.swal2-top{grid-template-columns:auto minmax(0,1fr) auto}.swal2-container.swal2-bottom-end,.swal2-container.swal2-center-end,.swal2-container.swal2-top-end{grid-template-columns:auto auto minmax(0,1fr)}.swal2-container.swal2-top-start>.swal2-popup{align-self:start}.swal2-container.swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}.swal2-container.swal2-top-end>.swal2-popup,.swal2-container.swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}.swal2-container.swal2-center-left>.swal2-popup,.swal2-container.swal2-center-start>.swal2-popup{grid-row:2;align-self:center}.swal2-container.swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}.swal2-container.swal2-center-end>.swal2-popup,.swal2-container.swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}.swal2-container.swal2-bottom-left>.swal2-popup,.swal2-container.swal2-bottom-start>.swal2-popup{grid-column:1;grid-row:3;align-self:end}.swal2-container.swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}.swal2-container.swal2-bottom-end>.swal2-popup,.swal2-container.swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}.swal2-container.swal2-grow-fullscreen>.swal2-popup,.swal2-container.swal2-grow-row>.swal2-popup{grid-column:1/4;width:100%}.swal2-container.swal2-grow-column>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}.swal2-container.swal2-no-transition{transition:none!important}.swal2-popup{display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0,100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-title{position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px transparent;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}.swal2-styled.swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}.swal2-styled.swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled:focus{outline:0}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto!important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:2em auto 1em}.swal2-close{z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:0 0;color:#ccc;font-family:serif;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close:focus{outline:0;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em 2em 3px}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:0 0;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px transparent;color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em 2em 3px;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-file{width:75%;margin-right:auto;margin-left:auto;background:0 0;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:0 0;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto 0}.swal2-validation-message{align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-warning.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-i-mark .5s;animation:swal2-animate-i-mark .5s}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-info.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-i-mark .8s;animation:swal2-animate-i-mark .8s}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-question.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-question-mark .8s;animation:swal2-animate-question-mark .8s}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:0 0;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.leave-russia-now-and-apply-your-skills-to-the-world{display:flex;position:fixed;z-index:1939;top:0;right:0;bottom:0;left:0;flex-direction:column;align-items:center;justify-content:center;padding:25px 0 20px;background:#20232a;color:#fff;text-align:center}.leave-russia-now-and-apply-your-skills-to-the-world div{max-width:560px;margin:10px;line-height:146%}.leave-russia-now-and-apply-your-skills-to-the-world iframe{max-width:100%;max-height:55.5555555556vmin;margin:16px auto}.leave-russia-now-and-apply-your-skills-to-the-world strong{border-bottom:2px dashed #fff}.leave-russia-now-and-apply-your-skills-to-the-world button{display:flex;position:fixed;z-index:1940;top:0;right:0;align-items:center;justify-content:center;width:48px;height:48px;margin-right:10px;margin-bottom:-10px;border:none;background:0 0;color:#aaa;font-size:48px;font-weight:700;cursor:pointer}.leave-russia-now-and-apply-your-skills-to-the-world button:hover{color:#fff}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@-webkit-keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@-webkit-keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{background-color:transparent!important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:transparent;pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}");
    });

    /* src\Snippets\Breadcrumb.svelte generated by Svelte v3.49.0 */
    const file$s = "src\\Snippets\\Breadcrumb.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (39:4) {#if path.length > 0}
    function create_if_block_3$1(ctx) {
    	let a;
    	let u;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			u = element("u");
    			i = element("i");
    			i.textContent = "root";
    			add_location(i, file$s, 39, 67, 1366);
    			add_location(u, file$s, 39, 64, 1363);
    			attr_dev(a, "class", "font-w300 cursor-pointer");
    			add_location(a, file$s, 39, 8, 1307);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, u);
    			append_dev(u, i);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*goto*/ ctx[1](-1), false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(39:4) {#if path.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (46:8) {:else}
    function create_else_block_2$1(ctx) {
    	let span;
    	let t_value = /*pItem*/ ctx[3].replace('/', '') + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "font-w600");
    			add_location(span, file$s, 46, 12, 1667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*path*/ 1 && t_value !== (t_value = /*pItem*/ ctx[3].replace('/', '') + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(46:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:8) {#if idx < path.length - 1}
    function create_if_block_2$2(ctx) {
    	let a;
    	let u;
    	let t_value = /*pItem*/ ctx[3].replace('/', '') + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			u = element("u");
    			t = text(t_value);
    			add_location(u, file$s, 44, 69, 1603);
    			attr_dev(a, "class", "font-w300 cursor-pointer");
    			add_location(a, file$s, 44, 12, 1546);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, u);
    			append_dev(u, t);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*goto*/ ctx[1](/*idx*/ ctx[5]), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*path*/ 1 && t_value !== (t_value = /*pItem*/ ctx[3].replace('/', '') + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(43:8) {#if idx < path.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (42:4) {#each path as pItem, idx}
    function create_each_block_1(ctx) {
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (/*idx*/ ctx[5] < /*path*/ ctx[0].length - 1) return create_if_block_2$2;
    		return create_else_block_2$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t = text(" / ");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(42:4) {#each path as pItem, idx}",
    		ctx
    	});

    	return block;
    }

    // (60:8) {:else}
    function create_else_block_1$2(ctx) {
    	let div;
    	let i;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			i.textContent = "root";
    			add_location(i, file$s, 61, 16, 2291);
    			attr_dev(div, "class", "dropdown-item");
    			add_location(div, file$s, 60, 12, 2247);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(60:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (56:8) {#if path.length > 0}
    function create_if_block_1$4(ctx) {
    	let div;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			i.textContent = "root";
    			add_location(i, file$s, 57, 16, 2188);
    			attr_dev(div, "class", "dropdown-item pup-a-nobold cursor-pointer");
    			add_location(div, file$s, 56, 12, 2096);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*goto*/ ctx[1](-1), false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(56:8) {#if path.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (71:12) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*pItem*/ ctx[3].replace("/", "") + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(" / ");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div, "class", "dropdown-item");
    			add_location(div, file$s, 71, 16, 2681);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*path*/ 1 && t1_value !== (t1_value = /*pItem*/ ctx[3].replace("/", "") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(71:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (66:12) {#if idx < path.length - 1}
    function create_if_block$6(ctx) {
    	let div;
    	let t0;
    	let span;
    	let t1_value = /*pItem*/ ctx[3].replace("/", "") + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(" / ");
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(span, "class", "pup-a-nobold cursor-pointer");
    			add_location(span, file$s, 67, 33, 2488);
    			attr_dev(div, "class", "dropdown-item");
    			add_location(div, file$s, 66, 16, 2427);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(span, t1);
    			append_dev(div, t2);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*goto*/ ctx[1](/*idx*/ ctx[5]), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*path*/ 1 && t1_value !== (t1_value = /*pItem*/ ctx[3].replace("/", "") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(66:12) {#if idx < path.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (65:8) {#each path as pItem, idx}
    function create_each_block$3(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*idx*/ ctx[5] < /*path*/ ctx[0].length - 1) return create_if_block$6;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(65:8) {#each path as pItem, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let div3;
    	let div1;
    	let t3;
    	let span;
    	let t4;
    	let div2;
    	let t5;
    	let if_block0 = /*path*/ ctx[0].length > 0 && create_if_block_3$1(ctx);
    	let each_value_1 = /*path*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	function select_block_type_1(ctx, dirty) {
    		if (/*path*/ ctx[0].length > 0) return create_if_block_1$4;
    		return create_else_block_1$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block1 = current_block_type(ctx);
    	let each_value = /*path*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text("📍\n    ");
    			if (if_block0) if_block0.c();
    			t1 = text(" / \n    ");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t3 = text("📍 ");
    			span = element("span");
    			t4 = space();
    			div2 = element("div");
    			if_block1.c();
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "hide-xs");
    			add_location(div0, file$s, 35, 0, 1194);
    			attr_dev(span, "class", "triangle");
    			add_location(span, file$s, 52, 16, 1952);
    			attr_dev(div1, "class", "navbar-link");
    			attr_dev(div1, "data-target", "Breadcrumb");
    			attr_dev(div1, "title", "Folder stack");
    			set_style(div1, "height", "40px");
    			add_location(div1, file$s, 51, 4, 1842);
    			attr_dev(div2, "class", "dropdown-content white shadow-1 rounded-1");
    			add_location(div2, file$s, 54, 4, 1998);
    			attr_dev(div3, "class", "dropdown hide-sm-up");
    			attr_dev(div3, "id", "Breadcrumb");
    			set_style(div3, "top", "-8px");
    			add_location(div3, file$s, 50, 0, 1769);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, t3);
    			append_dev(div1, span);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			if_block1.m(div2, null);
    			append_dev(div2, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*path*/ ctx[0].length > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					if_block0.m(div0, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*goto, path*/ 3) {
    				each_value_1 = /*path*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div2, t5);
    				}
    			}

    			if (dirty & /*goto, path*/ 3) {
    				each_value = /*path*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div3);
    			if_block1.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Breadcrumb', slots, []);
    	let { path = [] } = $$props;
    	const dispatch = createEventDispatcher();

    	onMount(() => {
    		new Dropdown("#Breadcrumb");
    	});

    	onDestroy(() => {
    		destroy("#Breadcrumb");
    	});

    	function goto(idx) {
    		return () => {
    			dispatch("pathEvent", { path: path.slice(0, idx + 1) });
    		};
    	}

    	const writable_props = ['path'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Breadcrumb> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		onMount,
    		destroy,
    		Dropdown,
    		path,
    		dispatch,
    		goto
    	});

    	$$self.$inject_state = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [path, goto];
    }

    class Breadcrumb extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { path: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Breadcrumb",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get path() {
    		throw new Error("<Breadcrumb>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Breadcrumb>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconLink.svelte generated by Svelte v3.49.0 */

    const file$r = "src\\SVG\\IconLink.svelte";

    function create_fragment$r(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z");
    			add_location(path, file$r, 11, 4, 317);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$r, 5, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconLink', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconLink> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconLink",
    			options,
    			id: create_fragment$r.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconLink> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconInvalidLink.svelte generated by Svelte v3.49.0 */

    const file$q = "src\\SVG\\IconInvalidLink.svelte";

    function create_fragment$q(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M2,5.27L3.28,4L20,20.72L18.73,22L13.9,17.17L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L12.5,15.76L10.88,14.15C10.87,14.39 10.77,14.64 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C8.12,13.77 7.63,12.37 7.72,11L2,5.27M12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.79,8.97L9.38,7.55L12.71,4.22M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.2,10.54 16.61,12.5 16.06,14.23L14.28,12.46C14.23,11.78 13.94,11.11 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z");
    			add_location(path, file$q, 12, 4, 340);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$q, 5, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconInvalidLink', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconInvalidLink> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconInvalidLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconInvalidLink",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconInvalidLink> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconInvalidLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconInvalidLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconInvalidLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconInvalidLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\FileManager\GridCell.svelte generated by Svelte v3.49.0 */
    const file$p = "src\\FileManager\\GridCell.svelte";

    // (43:12) {:else}
    function create_else_block_1$1(ctx) {
    	let img;
    	let img_alt_value;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "alt", img_alt_value = /*item*/ ctx[0].icon[0]);
    			if (!src_url_equal(img.src, img_src_value = "icons/48x48/" + /*item*/ ctx[0].icon[0] + ".svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$p, 43, 16, 1882);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 1 && img_alt_value !== (img_alt_value = /*item*/ ctx[0].icon[0])) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = "icons/48x48/" + /*item*/ ctx[0].icon[0] + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(43:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (36:12) {#if !!item.icon[1]}
    function create_if_block$5(ctx) {
    	let img;
    	let img_alt_value;
    	let img_src_value;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*item*/ ctx[0].icon[1] == "link") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			img = element("img");
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(img, "alt", img_alt_value = /*item*/ ctx[0].icon[0]);
    			if (!src_url_equal(img.src, img_src_value = "icons/48x48/" + /*item*/ ctx[0].icon[0] + ".svg")) attr_dev(img, "src", img_src_value);
    			set_style(img, "position", "relative");
    			set_style(img, "left", "12px");
    			add_location(img, file$p, 36, 16, 1562);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*item*/ 1 && img_alt_value !== (img_alt_value = /*item*/ ctx[0].icon[0])) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (!current || dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = "icons/48x48/" + /*item*/ ctx[0].icon[0] + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(36:12) {#if !!item.icon[1]}",
    		ctx
    	});

    	return block;
    }

    // (40:16) {:else}
    function create_else_block$3(ctx) {
    	let iconinvalidlink;
    	let current;
    	iconinvalidlink = new IconInvalidLink({ props: { size: "22" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconinvalidlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconinvalidlink, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconinvalidlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconinvalidlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconinvalidlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(40:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:16) {#if item.icon[1] == "link"}
    function create_if_block_1$3(ctx) {
    	let iconlink;
    	let current;
    	iconlink = new IconLink({ props: { size: "22" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconlink, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(38:16) {#if item.icon[1] == \\\"link\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div6;
    	let div5;
    	let span0;
    	let t0_value = /*item*/ ctx[0].size + "";
    	let t0;
    	let t1;
    	let div0;
    	let span1;
    	let t3;
    	let div1;
    	let t5;
    	let div2;
    	let current_block_type_index;
    	let if_block;
    	let t6;
    	let div3;
    	let t8;
    	let div4;
    	let t9_value = /*item*/ ctx[0].name + "";
    	let t9;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$5, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!!/*item*/ ctx[0].icon[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div5 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "️";
    			t3 = space();
    			div1 = element("div");
    			div1.textContent = " ";
    			t5 = space();
    			div2 = element("div");
    			if_block.c();
    			t6 = space();
    			div3 = element("div");
    			div3.textContent = " ";
    			t8 = space();
    			div4 = element("div");
    			t9 = text(t9_value);
    			attr_dev(span0, "class", "font-w100 hide-sm-down");
    			add_location(span0, file$p, 29, 8, 1225);
    			attr_dev(span1, "class", "cursor-pointer menu mr-1");
    			add_location(span1, file$p, 31, 12, 1329);
    			set_style(div0, "float", "right");
    			add_location(div0, file$p, 30, 8, 1289);
    			set_style(div1, "clear", "both");
    			add_location(div1, file$p, 33, 8, 1440);
    			attr_dev(div2, "class", "text-center");
    			add_location(div2, file$p, 34, 8, 1487);
    			add_location(div3, file$p, 46, 8, 1986);
    			attr_dev(div4, "class", "text-center ellipsis pb-3");
    			add_location(div4, file$p, 47, 8, 2012);
    			attr_dev(div5, "class", "card-content lh-1");
    			add_location(div5, file$p, 28, 4, 1185);
    			attr_dev(div6, "class", "card shadow-1 hoverable-1 rounded-3 overflow-visible white");
    			add_location(div6, file$p, 26, 0, 1061);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, span0);
    			append_dev(span0, t0);
    			append_dev(div5, t1);
    			append_dev(div5, div0);
    			append_dev(div0, span1);
    			append_dev(div5, t3);
    			append_dev(div5, div1);
    			append_dev(div5, t5);
    			append_dev(div5, div2);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div5, t6);
    			append_dev(div5, div3);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, t9);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span1, "click", stop_propagation(/*toProperties*/ ctx[1]), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*item*/ 1) && t0_value !== (t0_value = /*item*/ ctx[0].size + "")) set_data_dev(t0, t0_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div2, null);
    			}

    			if ((!current || dirty & /*item*/ 1) && t9_value !== (t9_value = /*item*/ ctx[0].name + "")) set_data_dev(t9, t9_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GridCell', slots, []);
    	let { item } = $$props;
    	const dispatch = createEventDispatcher();

    	function toProperties() {
    		dispatch("openPropsModal", { file: item });
    	}

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GridCell> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		IconLink,
    		IconInvalidLink,
    		item,
    		dispatch,
    		toProperties
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, toProperties];
    }

    class GridCell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GridCell",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<GridCell> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<GridCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<GridCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\FileManager\Grid.svelte generated by Svelte v3.49.0 */
    const file$o = "src\\FileManager\\Grid.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (29:4) {#each itemList as item, i (item.uuid)}
    function create_each_block$2(key_1, ctx) {
    	let div;
    	let gridcell;
    	let t;
    	let div_title_value;
    	let current;
    	let mounted;
    	let dispose;

    	gridcell = new GridCell({
    			props: { item: /*item*/ ctx[5] },
    			$$inline: true
    		});

    	gridcell.$on("reload", /*reload_handler*/ ctx[2]);
    	gridcell.$on("openPropsModal", /*openPropsModal_handler*/ ctx[3]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(gridcell.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "m-3 cursor-pointer");
    			attr_dev(div, "title", div_title_value = /*item*/ ctx[5].name);
    			set_style(div, "z-index", /*itemList*/ ctx[0].length + 1 - /*i*/ ctx[7]);
    			add_location(div, file$o, 31, 8, 1242);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(gridcell, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*click*/ ctx[1](/*item*/ ctx[5].uuid))) /*click*/ ctx[1](/*item*/ ctx[5].uuid).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const gridcell_changes = {};
    			if (dirty & /*itemList*/ 1) gridcell_changes.item = /*item*/ ctx[5];
    			gridcell.$set(gridcell_changes);

    			if (!current || dirty & /*itemList*/ 1 && div_title_value !== (div_title_value = /*item*/ ctx[5].name)) {
    				attr_dev(div, "title", div_title_value);
    			}

    			if (!current || dirty & /*itemList*/ 1) {
    				set_style(div, "z-index", /*itemList*/ ctx[0].length + 1 - /*i*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gridcell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gridcell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(gridcell);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(29:4) {#each itemList as item, i (item.uuid)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*itemList*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[5].uuid;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "grix xs2 sm3 md4 lg6 xl8");
    			add_location(div, file$o, 27, 0, 1022);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*itemList, click*/ 3) {
    				each_value = /*itemList*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, []);
    	let { itemList } = $$props;
    	const dispatch = createEventDispatcher();

    	function click(uuid) {
    		return e => {
    			dispatch("openItem", { uuid });
    		};
    	}

    	const writable_props = ['itemList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	function reload_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function openPropsModal_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('itemList' in $$props) $$invalidate(0, itemList = $$props.itemList);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		GridCell,
    		itemList,
    		dispatch,
    		click
    	});

    	$$self.$inject_state = $$props => {
    		if ('itemList' in $$props) $$invalidate(0, itemList = $$props.itemList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [itemList, click, reload_handler, openPropsModal_handler];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { itemList: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*itemList*/ ctx[0] === undefined && !('itemList' in props)) {
    			console.warn("<Grid> was created without expected prop 'itemList'");
    		}
    	}

    	get itemList() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemList(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\FileManager\ListRow.svelte generated by Svelte v3.49.0 */
    const file$n = "src\\FileManager\\ListRow.svelte";

    function create_fragment$n(ctx) {
    	let tr;
    	let td0;
    	let div0;
    	let img0;
    	let img0_alt_value;
    	let img0_src_value;
    	let t0;
    	let span0;
    	let t1_value = /*item*/ ctx[0].icon[2] + "";
    	let t1;
    	let t2_value = /*item*/ ctx[0].name + "";
    	let t2;
    	let t3;
    	let div1;
    	let img1;
    	let img1_alt_value;
    	let img1_src_value;
    	let t4;
    	let span1;
    	let t5_value = /*item*/ ctx[0].icon[2] + "";
    	let t5;
    	let t6_value = /*item*/ ctx[0].name + "";
    	let t6;
    	let t7;
    	let td1;
    	let t8_value = /*item*/ ctx[0].size + "";
    	let t8;
    	let t9;
    	let td2;
    	let t10_value = /*item*/ ctx[0].chDate + "";
    	let t10;
    	let t11;
    	let td3;
    	let div2;
    	let span2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = text(" ");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t4 = text(" ");
    			span1 = element("span");
    			t5 = text(t5_value);
    			t6 = text(t6_value);
    			t7 = space();
    			td1 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td2 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td3 = element("td");
    			div2 = element("div");
    			span2 = element("span");
    			span2.textContent = "️";
    			attr_dev(img0, "alt", img0_alt_value = /*item*/ ctx[0].icon[0]);
    			attr_dev(img0, "class", "txt-mid svelte-pq8k21");
    			if (!src_url_equal(img0.src, img0_src_value = "icons/16x16/" + /*item*/ ctx[0].icon[0] + ".svg")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$n, 55, 12, 1530);
    			attr_dev(span0, "class", "txt-mid svelte-pq8k21");
    			add_location(span0, file$n, 55, 96, 1614);
    			attr_dev(div0, "class", "wid220 ellipsis hide-md-up");
    			add_location(div0, file$n, 54, 8, 1477);
    			attr_dev(img1, "alt", img1_alt_value = /*item*/ ctx[0].icon[0]);
    			attr_dev(img1, "class", "txt-mid svelte-pq8k21");
    			if (!src_url_equal(img1.src, img1_src_value = "icons/16x16/" + /*item*/ ctx[0].icon[0] + ".svg")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$n, 59, 12, 1747);
    			attr_dev(span1, "class", "txt-mid svelte-pq8k21");
    			add_location(span1, file$n, 59, 96, 1831);
    			attr_dev(div1, "class", "hide-sm-down");
    			add_location(div1, file$n, 58, 8, 1708);
    			attr_dev(td0, "class", "cursor-pointer nowrap minWid50Percent svelte-pq8k21");
    			add_location(td0, file$n, 53, 4, 1390);
    			attr_dev(td1, "class", "cursor-pointer nowrap minWid20Percent svelte-pq8k21");
    			add_location(td1, file$n, 63, 4, 1931);
    			attr_dev(td2, "class", "hide-sm-down cursor-pointer nowrap minWid20Percent svelte-pq8k21");
    			add_location(td2, file$n, 64, 4, 2030);
    			attr_dev(span2, "class", "cursor-pointer menu");
    			add_location(span2, file$n, 67, 12, 2224);
    			attr_dev(div2, "class", "w100");
    			add_location(div2, file$n, 66, 8, 2193);
    			attr_dev(td3, "class", "minWid10Percent text-center svelte-pq8k21");
    			add_location(td3, file$n, 65, 4, 2144);
    			add_location(tr, file$n, 52, 0, 1381);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, span0);
    			append_dev(span0, t1);
    			append_dev(span0, t2);
    			append_dev(td0, t3);
    			append_dev(td0, div1);
    			append_dev(div1, img1);
    			append_dev(div1, t4);
    			append_dev(div1, span1);
    			append_dev(span1, t5);
    			append_dev(span1, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td1);
    			append_dev(td1, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td2);
    			append_dev(td2, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td3);
    			append_dev(td3, div2);
    			append_dev(div2, span2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						td0,
    						"click",
    						function () {
    							if (is_function(/*click*/ ctx[1](/*item*/ ctx[0].uuid))) /*click*/ ctx[1](/*item*/ ctx[0].uuid).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						td1,
    						"click",
    						function () {
    							if (is_function(/*click*/ ctx[1](/*item*/ ctx[0].uuid))) /*click*/ ctx[1](/*item*/ ctx[0].uuid).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						td2,
    						"click",
    						function () {
    							if (is_function(/*click*/ ctx[1](/*item*/ ctx[0].uuid))) /*click*/ ctx[1](/*item*/ ctx[0].uuid).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(span2, "click", stop_propagation(/*toProperties*/ ctx[2]), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*item*/ 1 && img0_alt_value !== (img0_alt_value = /*item*/ ctx[0].icon[0])) {
    				attr_dev(img0, "alt", img0_alt_value);
    			}

    			if (dirty & /*item*/ 1 && !src_url_equal(img0.src, img0_src_value = "icons/16x16/" + /*item*/ ctx[0].icon[0] + ".svg")) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*item*/ 1 && t1_value !== (t1_value = /*item*/ ctx[0].icon[2] + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*item*/ 1 && t2_value !== (t2_value = /*item*/ ctx[0].name + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*item*/ 1 && img1_alt_value !== (img1_alt_value = /*item*/ ctx[0].icon[0])) {
    				attr_dev(img1, "alt", img1_alt_value);
    			}

    			if (dirty & /*item*/ 1 && !src_url_equal(img1.src, img1_src_value = "icons/16x16/" + /*item*/ ctx[0].icon[0] + ".svg")) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (dirty & /*item*/ 1 && t5_value !== (t5_value = /*item*/ ctx[0].icon[2] + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*item*/ 1 && t6_value !== (t6_value = /*item*/ ctx[0].name + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*item*/ 1 && t8_value !== (t8_value = /*item*/ ctx[0].size + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*item*/ 1 && t10_value !== (t10_value = /*item*/ ctx[0].chDate + "")) set_data_dev(t10, t10_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListRow', slots, []);
    	let { item } = $$props;
    	const dispatch = createEventDispatcher();

    	function click(uuid) {
    		return e => {
    			dispatch("openItem", { uuid });
    		};
    	}

    	function toProperties() {
    		dispatch("openPropsModal", { file: item });
    	}

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ListRow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		item,
    		dispatch,
    		click,
    		toProperties
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, click, toProperties];
    }

    class ListRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListRow",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<ListRow> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<ListRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ListRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\FileManager\List.svelte generated by Svelte v3.49.0 */

    const { Map: Map_1 } = globals;
    const file$m = "src\\FileManager\\List.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (71:8) {#each itemList as item (item.uuid)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let listrow;
    	let current;

    	listrow = new ListRow({
    			props: { item: /*item*/ ctx[13] },
    			$$inline: true
    		});

    	listrow.$on("openItem", /*openItem_handler*/ ctx[5]);
    	listrow.$on("reload", /*reload_handler*/ ctx[6]);
    	listrow.$on("openPropsModal", /*openPropsModal_handler*/ ctx[7]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(listrow.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(listrow, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const listrow_changes = {};
    			if (dirty & /*itemList*/ 2) listrow_changes.item = /*item*/ ctx[13];
    			listrow.$set(listrow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(listrow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(71:8) {#each itemList as item (item.uuid)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let table;
    	let tr;
    	let th0;
    	let html_tag;
    	let raw0_value = /*getCaret*/ ctx[3](/*WHERES*/ ctx[2].NAME, /*sorter*/ ctx[0]) + "";
    	let t0;
    	let t1;
    	let th1;
    	let html_tag_1;
    	let raw1_value = /*getCaret*/ ctx[3](/*WHERES*/ ctx[2].SIZE, /*sorter*/ ctx[0]) + "";
    	let t2;
    	let t3;
    	let th2;
    	let html_tag_2;
    	let raw2_value = /*getCaret*/ ctx[3](/*WHERES*/ ctx[2].DATE, /*sorter*/ ctx[0]) + "";
    	let t4;
    	let t5;
    	let each_blocks = [];
    	let each_1_lookup = new Map_1();
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*itemList*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[13].uuid;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			html_tag = new HtmlTag(false);
    			t0 = text("\n                Name");
    			t1 = space();
    			th1 = element("th");
    			html_tag_1 = new HtmlTag(false);
    			t2 = text("Size");
    			t3 = space();
    			th2 = element("th");
    			html_tag_2 = new HtmlTag(false);
    			t4 = text("Mod. Date");
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			html_tag.a = t0;
    			attr_dev(th0, "class", "noSelect cursor-pointer");
    			add_location(th0, file$m, 63, 12, 2456);
    			html_tag_1.a = t2;
    			add_location(th1, file$m, 66, 12, 2614);
    			html_tag_2.a = t4;
    			attr_dev(th2, "class", "hide-sm-down");
    			add_location(th2, file$m, 67, 12, 2710);
    			add_location(tr, file$m, 62, 8, 2439);
    			attr_dev(table, "class", "table");
    			add_location(table, file$m, 61, 4, 2409);
    			attr_dev(div, "class", "table-responsive w100");
    			add_location(div, file$m, 60, 0, 2369);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			html_tag.m(raw0_value, th0);
    			append_dev(th0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			html_tag_1.m(raw1_value, th1);
    			append_dev(th1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			html_tag_2.m(raw2_value, th2);
    			append_dev(th2, t4);
    			append_dev(table, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(th0, "click", /*chSorter*/ ctx[4](/*WHERES*/ ctx[2].NAME), false, false, false),
    					listen_dev(th1, "click", /*chSorter*/ ctx[4](/*WHERES*/ ctx[2].SIZE), false, false, false),
    					listen_dev(th2, "click", /*chSorter*/ ctx[4](/*WHERES*/ ctx[2].DATE), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*sorter*/ 1) && raw0_value !== (raw0_value = /*getCaret*/ ctx[3](/*WHERES*/ ctx[2].NAME, /*sorter*/ ctx[0]) + "")) html_tag.p(raw0_value);
    			if ((!current || dirty & /*sorter*/ 1) && raw1_value !== (raw1_value = /*getCaret*/ ctx[3](/*WHERES*/ ctx[2].SIZE, /*sorter*/ ctx[0]) + "")) html_tag_1.p(raw1_value);
    			if ((!current || dirty & /*sorter*/ 1) && raw2_value !== (raw2_value = /*getCaret*/ ctx[3](/*WHERES*/ ctx[2].DATE, /*sorter*/ ctx[0]) + "")) html_tag_2.p(raw2_value);

    			if (dirty & /*itemList*/ 2) {
    				each_value = /*itemList*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, table, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const CARET_DOWN = '<span class="monospace font-s1">️ᐁ&nbsp;</span>';
    const CARET_UP = '<span class="monospace font-s1">ᐃ&nbsp;</span>';
    const CARET_NO = '<span class="monospace font-s1">&nbsp;&nbsp;</span>';

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, []);
    	let { itemList } = $$props;
    	let { sorter } = $$props;
    	const CARETS = [CARET_UP, CARET_DOWN];
    	const WHERES = { NAME: "N", DATE: "D", SIZE: "S" };
    	const SORTERS_DECODED = new Map();
    	SORTERS_DECODED.set(SORTERS.ABC, [WHERES.NAME, 0]);
    	SORTERS_DECODED.set(SORTERS.CBA, [WHERES.NAME, 1]);
    	SORTERS_DECODED.set(SORTERS.OldFirst, [WHERES.DATE, 0]);
    	SORTERS_DECODED.set(SORTERS.OldLast, [WHERES.DATE, 1]);
    	SORTERS_DECODED.set(SORTERS.SmallFirst, [WHERES.SIZE, 0]);
    	SORTERS_DECODED.set(SORTERS.SmallLast, [WHERES.SIZE, 1]);
    	const SORTERS_BY_COORDS = new Map();
    	SORTERS_BY_COORDS.set(WHERES.NAME, [SORTERS.ABC, SORTERS.CBA]);
    	SORTERS_BY_COORDS.set(WHERES.DATE, [SORTERS.OldFirst, SORTERS.OldLast]);
    	SORTERS_BY_COORDS.set(WHERES.SIZE, [SORTERS.SmallFirst, SORTERS.SmallLast]);
    	let sortingWhere;
    	let sortingHow;

    	function getCaret(where) {
    		if (sortingWhere != where) return CARET_NO;
    		return CARETS[sortingHow];
    	}

    	function chSorter(where) {
    		return function () {
    			if (sortingWhere == where) {
    				sortingHow = 1 - sortingHow;
    			} else {
    				sortingWhere = where;
    				sortingHow = 0;
    			}

    			$$invalidate(0, sorter = SORTERS_BY_COORDS.get(sortingWhere)[sortingHow]);
    		};
    	}

    	const writable_props = ['itemList', 'sorter'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	function openItem_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function reload_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function openPropsModal_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('itemList' in $$props) $$invalidate(1, itemList = $$props.itemList);
    		if ('sorter' in $$props) $$invalidate(0, sorter = $$props.sorter);
    	};

    	$$self.$capture_state = () => ({
    		ListRow,
    		SORTERS,
    		itemList,
    		sorter,
    		CARET_DOWN,
    		CARET_UP,
    		CARET_NO,
    		CARETS,
    		WHERES,
    		SORTERS_DECODED,
    		SORTERS_BY_COORDS,
    		sortingWhere,
    		sortingHow,
    		getCaret,
    		chSorter
    	});

    	$$self.$inject_state = $$props => {
    		if ('itemList' in $$props) $$invalidate(1, itemList = $$props.itemList);
    		if ('sorter' in $$props) $$invalidate(0, sorter = $$props.sorter);
    		if ('sortingWhere' in $$props) sortingWhere = $$props.sortingWhere;
    		if ('sortingHow' in $$props) sortingHow = $$props.sortingHow;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sorter*/ 1) {
    			{
    				[sortingWhere, sortingHow] = SORTERS_DECODED.get(sorter);
    			}
    		}
    	};

    	return [
    		sorter,
    		itemList,
    		WHERES,
    		getCaret,
    		chSorter,
    		openItem_handler,
    		reload_handler,
    		openPropsModal_handler
    	];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { itemList: 1, sorter: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*itemList*/ ctx[1] === undefined && !('itemList' in props)) {
    			console.warn("<List> was created without expected prop 'itemList'");
    		}

    		if (/*sorter*/ ctx[0] === undefined && !('sorter' in props)) {
    			console.warn("<List> was created without expected prop 'sorter'");
    		}
    	}

    	get itemList() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemList(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sorter() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sorter(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconGrid.svelte generated by Svelte v3.49.0 */

    const file$l = "src\\SVG\\IconGrid.svelte";

    function create_fragment$l(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M3 11H11V3H3M5 5H9V9H5M13 21H21V13H13M15 15H19V19H15M3 21H11V13H3M5 15H9V19H5M13 3V11H21V3M19 9H15V5H19Z");
    			add_location(path, file$l, 12, 4, 341);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$l, 5, 0, 136);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconGrid', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconGrid> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconGrid",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconGrid> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconList.svelte generated by Svelte v3.49.0 */

    const file$k = "src\\SVG\\IconList.svelte";

    function create_fragment$k(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8V5H4M4,19H8V15H4M4,14H8V10H4V14Z");
    			add_location(path, file$k, 12, 4, 341);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$k, 5, 0, 136);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconList', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconList",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconList> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconSortAlphAsc.svelte generated by Svelte v3.49.0 */

    const file$j = "src\\SVG\\IconSortAlphAsc.svelte";

    function create_fragment$j(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19 17H22L18 21L14 17H17V3H19M11 13V15L7.67 19H11V21H5V19L8.33 15H5V13M9 3H7C5.9 3 5 3.9 5 5V11H7V9H9V11H11V5C11 3.9 10.11 3 9 3M9 7H7V5H9Z");
    			add_location(path, file$j, 12, 4, 359);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$j, 5, 0, 154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconSortAlphAsc', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconSortAlphAsc> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconSortAlphAsc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortAlphAsc",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconSortAlphAsc> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconSortAlphAsc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconSortAlphAsc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconSortAlphAsc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconSortAlphAsc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconSortAlphDesc.svelte generated by Svelte v3.49.0 */

    const file$i = "src\\SVG\\IconSortAlphDesc.svelte";

    function create_fragment$i(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19 7H22L18 3L14 7H17V21H19M11 13V15L7.67 19H11V21H5V19L8.33 15H5V13M9 3H7C5.9 3 5 3.9 5 5V11H7V9H9V11H11V5C11 3.9 10.11 3 9 3M9 7H7V5H9Z");
    			add_location(path, file$i, 12, 4, 360);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$i, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconSortAlphDesc', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconSortAlphDesc> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconSortAlphDesc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortAlphDesc",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconSortAlphDesc> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconSortAlphDesc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconSortAlphDesc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconSortAlphDesc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconSortAlphDesc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconSortDateAsc.svelte generated by Svelte v3.49.0 */

    const file$h = "src\\SVG\\IconSortDateAsc.svelte";

    function create_fragment$h(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M21 17H24L20 21L16 17H19V3H21V17M8 16H11V13H8V16M13 5H12V3H10V5H6V3H4V5H3C1.89 5 1 5.89 1 7V18C1 19.11 1.89 20 3 20H13C14.11 20 15 19.11 15 18V7C15 5.89 14.11 5 13 5M3 18L3 11H13L13 18L3 18Z");
    			add_location(path, file$h, 12, 4, 355);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$h, 5, 0, 150);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconSortDateAsc', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconSortDateAsc> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconSortDateAsc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortDateAsc",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconSortDateAsc> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconSortDateAsc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconSortDateAsc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconSortDateAsc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconSortDateAsc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconSortDateDesc.svelte generated by Svelte v3.49.0 */

    const file$g = "src\\SVG\\IconSortDateDesc.svelte";

    function create_fragment$g(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19 7H16L20 3L24 7H21V21H19V7M8 16H11V13H8V16M13 5H12V3H10V5H6V3H4V5H3C1.89 5 1 5.89 1 7V18C1 19.11 1.89 20 3 20H13C14.11 20 15 19.11 15 18V7C15 5.89 14.11 5 13 5M3 18L3 11H13L13 18L3 18Z");
    			add_location(path, file$g, 12, 4, 356);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$g, 5, 0, 151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconSortDateDesc', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconSortDateDesc> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconSortDateDesc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortDateDesc",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconSortDateDesc> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconSortDateDesc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconSortDateDesc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconSortDateDesc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconSortDateDesc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconSortSizeAsc.svelte generated by Svelte v3.49.0 */

    const file$f = "src\\SVG\\IconSortSizeAsc.svelte";

    function create_fragment$f(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19 17H22L18 21L14 17H17V3H19M2 17H12V19H2M6 5V7H2V5M2 11H9V13H2V11Z");
    			add_location(path, file$f, 12, 4, 346);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$f, 5, 0, 141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconSortSizeAsc', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconSortSizeAsc> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconSortSizeAsc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortSizeAsc",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconSortSizeAsc> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconSortSizeAsc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconSortSizeAsc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconSortSizeAsc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconSortSizeAsc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconSortSizeDesc.svelte generated by Svelte v3.49.0 */

    const file$e = "src\\SVG\\IconSortSizeDesc.svelte";

    function create_fragment$e(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19 7H22L18 3L14 7H17V21H19M2 17H12V19H2M6 5V7H2V5M2 11H9V13H2V11Z");
    			add_location(path, file$e, 12, 4, 347);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$e, 5, 0, 142);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconSortSizeDesc', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconSortSizeDesc> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconSortSizeDesc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortSizeDesc",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconSortSizeDesc> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconSortSizeDesc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconSortSizeDesc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconSortSizeDesc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconSortSizeDesc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconPaste.svelte generated by Svelte v3.49.0 */

    const file$d = "src\\SVG\\IconPaste.svelte";

    function create_fragment$d(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z");
    			add_location(path, file$d, 12, 4, 345);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$d, 5, 0, 140);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconPaste', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconPaste> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconPaste extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconPaste",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconPaste> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconPaste>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconPaste>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconPaste>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconPaste>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconUnpaste.svelte generated by Svelte v3.49.0 */

    const file$c = "src\\SVG\\IconUnpaste.svelte";

    function create_fragment$c(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M3.27,1L2,2.27L6.22,6.5L3,9L4.63,10.27L12,16L14.1,14.37L15.53,15.8L12,18.54L4.63,12.81L3,14.07L12,21.07L16.95,17.22L20.73,21L22,19.73L3.27,1M19.36,10.27L21,9L12,2L9.09,4.27L16.96,12.15L19.36,10.27M19.81,15L21,14.07L19.57,12.64L18.38,13.56L19.81,15Z");
    			add_location(path, file$c, 12, 4, 342);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$c, 5, 0, 137);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconUnpaste', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconUnpaste> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconUnpaste extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconUnpaste",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconUnpaste> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconUnpaste>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconUnpaste>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconUnpaste>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconUnpaste>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconNewFolder.svelte generated by Svelte v3.49.0 */

    const file$b = "src\\SVG\\IconNewFolder.svelte";

    function create_fragment$b(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M12 12H14V10H16V12H18V14H16V16H14V14H12V12M22 8V18C22 19.11 21.11 20 20 20H4C2.89 20 2 19.11 2 18V6C2 4.89 2.89 4 4 4H10L12 6H20C21.11 6 22 6.89 22 8M20 8H4V18H20V8Z");
    			add_location(path, file$b, 12, 4, 351);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$b, 5, 0, 146);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconNewFolder', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconNewFolder> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconNewFolder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconNewFolder",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconNewFolder> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconNewFolder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconNewFolder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconNewFolder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconNewFolder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconUpload.svelte generated by Svelte v3.49.0 */

    const file$a = "src\\SVG\\IconUpload.svelte";

    function create_fragment$a(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04M19,18H6A4,4 0 0,1 2,14C2,11.95 3.53,10.24 5.56,10.03L6.63,9.92L7.13,8.97C8.08,7.14 9.94,6 12,6C14.62,6 16.88,7.86 17.39,10.43L17.69,11.93L19.22,12.04C20.78,12.14 22,13.45 22,15A3,3 0 0,1 19,18M8,13H10.55V16H13.45V13H16L12,9L8,13Z");
    			add_location(path, file$a, 12, 4, 352);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$a, 5, 0, 147);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconUpload', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconUpload> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconUpload extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconUpload",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconUpload> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconUpload>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconUpload>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconUpload>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconUpload>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconReload.svelte generated by Svelte v3.49.0 */

    const file$9 = "src\\SVG\\IconReload.svelte";

    function create_fragment$9(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z");
    			add_location(path, file$9, 12, 4, 338);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$9, 5, 0, 133);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconReload', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconReload> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconReload extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconReload",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconReload> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconReload>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconReload>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconReload>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconReload>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconShare.svelte generated by Svelte v3.49.0 */

    const file$8 = "src\\SVG\\IconShare.svelte";

    function create_fragment$8(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12S8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5S19.66 2 18 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12S4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.91 18 21.91S20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08M18 4C18.55 4 19 4.45 19 5S18.55 6 18 6 17 5.55 17 5 17.45 4 18 4M6 13C5.45 13 5 12.55 5 12S5.45 11 6 11 7 11.45 7 12 6.55 13 6 13M18 20C17.45 20 17 19.55 17 19S17.45 18 18 18 19 18.45 19 19 18.55 20 18 20Z");
    			add_location(path, file$8, 12, 4, 353);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$8, 5, 0, 148);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconShare', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconShare> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconShare extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconShare",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconShare> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconShare>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconShare>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconShare>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconShare>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Snippets\Properties.svelte generated by Svelte v3.49.0 */
    const file$7 = "src\\Snippets\\Properties.svelte";

    // (105:8) {#if !readOnly && (!item.isDir || item.name != '../')}
    function create_if_block$4(ctx) {
    	let div4;
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div2;
    	let t5;
    	let div3;
    	let t7;
    	let div12;
    	let div7;
    	let div5;
    	let t9;
    	let div6;
    	let t11;
    	let div8;
    	let t13;
    	let div11;
    	let div9;
    	let t15;
    	let div10;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			div0.textContent = "Cut";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "Copy";
    			t3 = space();
    			div2 = element("div");
    			div2.textContent = "Rename";
    			t5 = space();
    			div3 = element("div");
    			div3.textContent = "Delete";
    			t7 = space();
    			div12 = element("div");
    			div7 = element("div");
    			div5 = element("div");
    			div5.textContent = "Cut";
    			t9 = space();
    			div6 = element("div");
    			div6.textContent = "Copy";
    			t11 = space();
    			div8 = element("div");
    			div8.textContent = " ";
    			t13 = space();
    			div11 = element("div");
    			div9 = element("div");
    			div9.textContent = "Rename";
    			t15 = space();
    			div10 = element("div");
    			div10.textContent = "Delete";
    			attr_dev(div0, "class", "btn primary");
    			add_location(div0, file$7, 106, 16, 3785);
    			attr_dev(div1, "class", "btn primary");
    			add_location(div1, file$7, 107, 16, 3877);
    			attr_dev(div2, "class", "btn primary");
    			add_location(div2, file$7, 108, 16, 3971);
    			attr_dev(div3, "class", "btn error");
    			add_location(div3, file$7, 109, 16, 4059);
    			attr_dev(div4, "class", "btn-group btn-group-small rounded-1 hide-xs mx-auto");
    			add_location(div4, file$7, 105, 12, 3703);
    			attr_dev(div5, "class", "btn primary");
    			add_location(div5, file$7, 113, 20, 4276);
    			attr_dev(div6, "class", "btn primary");
    			add_location(div6, file$7, 114, 20, 4372);
    			attr_dev(div7, "class", "btn-group btn-group-small rounded-1 mx-auto");
    			add_location(div7, file$7, 112, 16, 4198);
    			add_location(div8, file$7, 116, 16, 4489);
    			attr_dev(div9, "class", "btn primary");
    			add_location(div9, file$7, 118, 20, 4601);
    			attr_dev(div10, "class", "btn error");
    			add_location(div10, file$7, 119, 20, 4693);
    			attr_dev(div11, "class", "btn-group btn-group-small rounded-1 mx-auto");
    			add_location(div11, file$7, 117, 16, 4523);
    			attr_dev(div12, "class", "hide-sm-up");
    			add_location(div12, file$7, 111, 12, 4157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div7);
    			append_dev(div7, div5);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div12, t11);
    			append_dev(div12, div8);
    			append_dev(div12, t13);
    			append_dev(div12, div11);
    			append_dev(div11, div9);
    			append_dev(div11, t15);
    			append_dev(div11, div10);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", stop_propagation(/*toPaste*/ ctx[4](true)), false, false, true),
    					listen_dev(div1, "click", stop_propagation(/*toPaste*/ ctx[4](false)), false, false, true),
    					listen_dev(div2, "click", stop_propagation(/*rename*/ ctx[2]), false, false, true),
    					listen_dev(div3, "click", stop_propagation(/*del*/ ctx[3]), false, false, true),
    					listen_dev(div5, "click", stop_propagation(/*toPaste*/ ctx[4](true)), false, false, true),
    					listen_dev(div6, "click", stop_propagation(/*toPaste*/ ctx[4](false)), false, false, true),
    					listen_dev(div9, "click", stop_propagation(/*rename*/ ctx[2]), false, false, true),
    					listen_dev(div10, "click", stop_propagation(/*del*/ ctx[3]), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div12);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(105:8) {#if !readOnly && (!item.isDir || item.name != '../')}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div3;
    	let div0;
    	let img;
    	let img_alt_value;
    	let img_src_value;
    	let t0;
    	let t1_value = /*item*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let div2;
    	let p0;
    	let b0;
    	let t4;
    	let span;
    	let t5_value = /*item*/ ctx[0].name + "";
    	let t5;
    	let span_title_value;
    	let t6;
    	let p1;
    	let b1;
    	let t8;
    	let t9_value = /*item*/ ctx[0].size + "";
    	let t9;
    	let t10;
    	let p2;
    	let b2;
    	let t12;
    	let t13_value = /*item*/ ctx[0].chDate + "";
    	let t13;
    	let t14;
    	let p3;
    	let b3;
    	let t16;
    	let t17_value = /*item*/ ctx[0].mimeType + "";
    	let t17;
    	let t18;
    	let p4;
    	let b4;
    	let t20;
    	let t21_value = /*item*/ ctx[0].owner + "";
    	let t21;
    	let t22;
    	let p5;
    	let b5;
    	let t24;
    	let t25_value = /*item*/ ctx[0].group + "";
    	let t25;
    	let t26;
    	let p6;
    	let b6;
    	let t28;
    	let t29_value = /*item*/ ctx[0].permissions + "";
    	let t29;
    	let t30;
    	let div1;
    	let t32;
    	let if_block = !/*readOnly*/ ctx[1] && (!/*item*/ ctx[0].isDir || /*item*/ ctx[0].name != '../') && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = text(" ");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			p0 = element("p");
    			b0 = element("b");
    			b0.textContent = "File name:";
    			t4 = space();
    			span = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			p1 = element("p");
    			b1 = element("b");
    			b1.textContent = "Size:";
    			t8 = space();
    			t9 = text(t9_value);
    			t10 = space();
    			p2 = element("p");
    			b2 = element("b");
    			b2.textContent = "Mod. date:";
    			t12 = space();
    			t13 = text(t13_value);
    			t14 = space();
    			p3 = element("p");
    			b3 = element("b");
    			b3.textContent = "Type:";
    			t16 = space();
    			t17 = text(t17_value);
    			t18 = space();
    			p4 = element("p");
    			b4 = element("b");
    			b4.textContent = "Owner:";
    			t20 = space();
    			t21 = text(t21_value);
    			t22 = space();
    			p5 = element("p");
    			b5 = element("b");
    			b5.textContent = "Group:";
    			t24 = space();
    			t25 = text(t25_value);
    			t26 = space();
    			p6 = element("p");
    			b6 = element("b");
    			b6.textContent = "Permissions:";
    			t28 = space();
    			t29 = text(t29_value);
    			t30 = space();
    			div1 = element("div");
    			div1.textContent = " ";
    			t32 = space();
    			if (if_block) if_block.c();
    			attr_dev(img, "alt", img_alt_value = /*item*/ ctx[0].icon[0]);
    			if (!src_url_equal(img.src, img_src_value = "icons/48x48/" + /*item*/ ctx[0].icon[0] + ".svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$7, 93, 8, 3005);
    			attr_dev(div0, "class", "modal-header ellipsis");
    			add_location(div0, file$7, 92, 4, 2961);
    			add_location(b0, file$7, 96, 28, 3166);
    			attr_dev(span, "title", span_title_value = /*item*/ ctx[0].name);
    			add_location(span, file$7, 96, 46, 3184);
    			attr_dev(p0, "class", "ellipsis");
    			add_location(p0, file$7, 96, 8, 3146);
    			add_location(b1, file$7, 97, 28, 3259);
    			attr_dev(p1, "class", "ellipsis");
    			add_location(p1, file$7, 97, 8, 3239);
    			add_location(b2, file$7, 98, 28, 3316);
    			attr_dev(p2, "class", "ellipsis");
    			add_location(p2, file$7, 98, 8, 3296);
    			add_location(b3, file$7, 99, 28, 3380);
    			attr_dev(p3, "class", "ellipsis");
    			add_location(p3, file$7, 99, 8, 3360);
    			add_location(b4, file$7, 100, 28, 3441);
    			attr_dev(p4, "class", "ellipsis");
    			add_location(p4, file$7, 100, 8, 3421);
    			add_location(b5, file$7, 101, 28, 3500);
    			attr_dev(p5, "class", "ellipsis");
    			add_location(p5, file$7, 101, 8, 3480);
    			add_location(b6, file$7, 102, 28, 3559);
    			attr_dev(p6, "class", "ellipsis");
    			add_location(p6, file$7, 102, 8, 3539);
    			add_location(div1, file$7, 103, 8, 3610);
    			attr_dev(div2, "class", "modal-content container");
    			add_location(div2, file$7, 95, 4, 3100);
    			attr_dev(div3, "class", "modal shadow-1 white rounded-3 modal-bouncing");
    			attr_dev(div3, "id", "modal-properties");
    			add_location(div3, file$7, 91, 0, 2875);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, p0);
    			append_dev(p0, b0);
    			append_dev(p0, t4);
    			append_dev(p0, span);
    			append_dev(span, t5);
    			append_dev(div2, t6);
    			append_dev(div2, p1);
    			append_dev(p1, b1);
    			append_dev(p1, t8);
    			append_dev(p1, t9);
    			append_dev(div2, t10);
    			append_dev(div2, p2);
    			append_dev(p2, b2);
    			append_dev(p2, t12);
    			append_dev(p2, t13);
    			append_dev(div2, t14);
    			append_dev(div2, p3);
    			append_dev(p3, b3);
    			append_dev(p3, t16);
    			append_dev(p3, t17);
    			append_dev(div2, t18);
    			append_dev(div2, p4);
    			append_dev(p4, b4);
    			append_dev(p4, t20);
    			append_dev(p4, t21);
    			append_dev(div2, t22);
    			append_dev(div2, p5);
    			append_dev(p5, b5);
    			append_dev(p5, t24);
    			append_dev(p5, t25);
    			append_dev(div2, t26);
    			append_dev(div2, p6);
    			append_dev(p6, b6);
    			append_dev(p6, t28);
    			append_dev(p6, t29);
    			append_dev(div2, t30);
    			append_dev(div2, div1);
    			append_dev(div2, t32);
    			if (if_block) if_block.m(div2, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*item*/ 1 && img_alt_value !== (img_alt_value = /*item*/ ctx[0].icon[0])) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = "icons/48x48/" + /*item*/ ctx[0].icon[0] + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*item*/ 1 && t1_value !== (t1_value = /*item*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*item*/ 1 && t5_value !== (t5_value = /*item*/ ctx[0].name + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*item*/ 1 && span_title_value !== (span_title_value = /*item*/ ctx[0].name)) {
    				attr_dev(span, "title", span_title_value);
    			}

    			if (dirty & /*item*/ 1 && t9_value !== (t9_value = /*item*/ ctx[0].size + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*item*/ 1 && t13_value !== (t13_value = /*item*/ ctx[0].chDate + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*item*/ 1 && t17_value !== (t17_value = /*item*/ ctx[0].mimeType + "")) set_data_dev(t17, t17_value);
    			if (dirty & /*item*/ 1 && t21_value !== (t21_value = /*item*/ ctx[0].owner + "")) set_data_dev(t21, t21_value);
    			if (dirty & /*item*/ 1 && t25_value !== (t25_value = /*item*/ ctx[0].group + "")) set_data_dev(t25, t25_value);
    			if (dirty & /*item*/ 1 && t29_value !== (t29_value = /*item*/ ctx[0].permissions + "")) set_data_dev(t29, t29_value);

    			if (!/*readOnly*/ ctx[1] && (!/*item*/ ctx[0].isDir || /*item*/ ctx[0].name != '../')) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Properties', slots, []);
    	let { item } = $$props;
    	let { readOnly } = $$props;
    	const dispatch = createEventDispatcher();
    	let modal = null;

    	onMount(() => {
    		modal = new Modal("#modal-properties", { bodyScrolling: true });
    		const modalQuery = document.querySelector("#modal-properties");

    		modalQuery.addEventListener("ax.modal.closed", function () {
    			destroy("#modal-properties");
    			dispatch("closePropsModal");
    		});

    		modal.open();
    	});

    	async function rename() {
    		const { value: nuName } = await sweetalert2_all.fire({
    			titleText: "Enter new name",
    			confirmButtonColor: "#0a6bb8",
    			showCancelButton: true,
    			input: "text",
    			inputValue: item.name.replaceAll("/", ""),
    			inputAttributes: {
    				autocapitalize: "off",
    				autocorrect: "off"
    			}
    		});

    		if (!nuName) {
    			return;
    		}

    		if (item.name == nuName) {
    			await sweetalert2_all.fire({
    				icon: "error",
    				text: "Old and new name must be different",
    				confirmButtonColor: "#0a6bb8"
    			});

    			return;
    		}

    		await sweetalert2_all.fire({
    			icon: "warning",
    			text: "Not implemented in the demo site",
    			confirmButtonColor: "#0a6bb8"
    		});

    		modal.close();
    	}

    	async function del() {
    		const { value: confirm } = await sweetalert2_all.fire({
    			html: "Do you really want to delete<br/><code>" + item.path + "</code>&nbsp;?",
    			icon: "question",
    			confirmButtonColor: "#0a6bb8",
    			showCancelButton: true,
    			cancelButtonText: "No"
    		});

    		if (!confirm) {
    			return;
    		}

    		await sweetalert2_all.fire({
    			icon: "warning",
    			text: "Not implemented in the demo site",
    			confirmButtonColor: "#0a6bb8"
    		});

    		modal.close();
    	}

    	function toPaste(isCut) {
    		return function () {
    			dispatch("toPaste", { file: item, isCut });
    			modal.close();
    		};
    	}

    	const writable_props = ['item', 'readOnly'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Properties> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		Modal,
    		destroy,
    		Swal: sweetalert2_all,
    		item,
    		readOnly,
    		dispatch,
    		modal,
    		rename,
    		del,
    		toPaste
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    		if ('modal' in $$props) modal = $$props.modal;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, readOnly, rename, del, toPaste];
    }

    class Properties extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { item: 0, readOnly: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Properties",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<Properties> was created without expected prop 'item'");
    		}

    		if (/*readOnly*/ ctx[1] === undefined && !('readOnly' in props)) {
    			console.warn("<Properties> was created without expected prop 'readOnly'");
    		}
    	}

    	get item() {
    		throw new Error("<Properties>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Properties>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readOnly() {
    		throw new Error("<Properties>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readOnly(value) {
    		throw new Error("<Properties>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Snippets\Sharing.svelte generated by Svelte v3.49.0 */
    const file$6 = "src\\Snippets\\Sharing.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (80:24) {#each config.sharing.profiles as prf, idx}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*prf*/ ctx[16] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*idx*/ ctx[18];
    			option.value = option.__value;
    			add_location(option, file$6, 80, 28, 2980);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*config*/ 1 && t_value !== (t_value = /*prf*/ ctx[16] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(80:24) {#each config.sharing.profiles as prf, idx}",
    		ctx
    	});

    	return block;
    }

    // (102:16) {#if expires}
    function create_if_block_2$1(ctx) {
    	let div;
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = " ";
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "for", "date");
    			add_location(label, file$6, 103, 24, 3991);
    			attr_dev(input, "type", "date");
    			attr_dev(input, "id", "date");
    			attr_dev(input, "class", "form-control rounded-1");
    			set_style(input, "margin-top", "-8px");
    			add_location(input, file$6, 104, 24, 4048);
    			attr_dev(div, "class", "form-field");
    			add_location(div, file$6, 102, 20, 3942);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			append_dev(div, input);
    			set_input_value(input, /*expiryDate*/ ctx[2]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[14]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*expiryDate*/ 4) {
    				set_input_value(input, /*expiryDate*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(102:16) {#if expires}",
    		ctx
    	});

    	return block;
    }

    // (116:8) {#if !!error}
    function create_if_block_1$2(ctx) {
    	let div;
    	let t;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[7]);
    			attr_dev(div, "class", "p-3 my-2 rounded-2 red light-3 text-red text-dark-4");
    			add_location(div, file$6, 116, 12, 4484);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*error*/ 128) set_data_dev(t, /*error*/ ctx[7]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(116:8) {#if !!error}",
    		ctx
    	});

    	return block;
    }

    // (121:8) {#if !!link}
    function create_if_block$3(ctx) {
    	let div;
    	let t;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*link*/ ctx[1]);
    			attr_dev(div, "class", "p-3 my-2 rounded-2 viride light-4 monospace svelte-4ly2lq");
    			add_location(div, file$6, 121, 12, 4656);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*link*/ 2) set_data_dev(t, /*link*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(121:8) {#if !!link}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div12;
    	let div0;
    	let t1;
    	let div9;
    	let form;
    	let div4;
    	let div2;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let t6;
    	let div3;
    	let label1;
    	let t8;
    	let select;
    	let t9;
    	let div8;
    	let div6;
    	let label2;
    	let t11;
    	let label3;
    	let input1;
    	let t12;
    	let span0;
    	let t13;
    	let t14;
    	let div5;
    	let t16;
    	let div7;
    	let label4;
    	let t18;
    	let label5;
    	let input2;
    	let t19;
    	let span1;
    	let t20;
    	let t21;
    	let t22;
    	let div11;
    	let div10;
    	let t24;
    	let t25;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*config*/ ctx[0].sharing.profiles;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block0 = /*expires*/ ctx[3] && create_if_block_2$1(ctx);
    	let if_block1 = !!/*error*/ ctx[7] && create_if_block_1$2(ctx);
    	let if_block2 = !!/*link*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div0 = element("div");
    			div0.textContent = "Sharing";
    			t1 = space();
    			div9 = element("div");
    			form = element("form");
    			div4 = element("div");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Password";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			div1.textContent = " ";
    			t6 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Profile";
    			t8 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			div8 = element("div");
    			div6 = element("div");
    			label2 = element("label");
    			label2.textContent = " ";
    			t11 = space();
    			label3 = element("label");
    			input1 = element("input");
    			t12 = space();
    			span0 = element("span");
    			t13 = text(" Read Only");
    			t14 = space();
    			div5 = element("div");
    			div5.textContent = " ";
    			t16 = space();
    			div7 = element("div");
    			label4 = element("label");
    			label4.textContent = " ";
    			t18 = space();
    			label5 = element("label");
    			input2 = element("input");
    			t19 = space();
    			span1 = element("span");
    			t20 = text(" Expires");
    			t21 = space();
    			if (if_block0) if_block0.c();
    			t22 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div10.textContent = "Generate link";
    			t24 = space();
    			if (if_block1) if_block1.c();
    			t25 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "modal-header text-center");
    			add_location(div0, file$6, 66, 4, 2185);
    			attr_dev(label0, "for", "shPassword");
    			add_location(label0, file$6, 71, 20, 2405);
    			attr_dev(input0, "type", "password");
    			attr_dev(input0, "id", "shPassword");
    			attr_dev(input0, "class", "form-control rounded-1");
    			attr_dev(input0, "placeholder", "Leave empty for no password");
    			add_location(input0, file$6, 72, 20, 2466);
    			add_location(div1, file$6, 74, 20, 2651);
    			attr_dev(div2, "class", "form-field");
    			add_location(div2, file$6, 70, 16, 2360);
    			attr_dev(label1, "for", "profile");
    			add_location(label1, file$6, 77, 20, 2753);
    			attr_dev(select, "class", "form-control rounded-1");
    			attr_dev(select, "id", "profile");
    			if (/*profile*/ ctx[4] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[11].call(select));
    			add_location(select, file$6, 78, 20, 2810);
    			attr_dev(div3, "class", "form-field");
    			add_location(div3, file$6, 76, 16, 2708);
    			attr_dev(div4, "class", "grix xs1 lg2 gutter-lg2");
    			add_location(div4, file$6, 69, 12, 2306);
    			attr_dev(label2, "for", "ro");
    			add_location(label2, file$6, 87, 20, 3230);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "id", "ro");
    			add_location(input1, file$6, 89, 24, 3341);
    			attr_dev(span0, "class", "form-slider");
    			add_location(span0, file$6, 90, 24, 3422);
    			attr_dev(label3, "class", "form-switch mx-auto");
    			add_location(label3, file$6, 88, 20, 3281);
    			add_location(div5, file$6, 92, 20, 3509);
    			attr_dev(div6, "class", "form-field");
    			add_location(div6, file$6, 86, 16, 3185);
    			attr_dev(label4, "for", "exp");
    			add_location(label4, file$6, 95, 20, 3611);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "id", "exp");
    			add_location(input2, file$6, 97, 24, 3723);
    			attr_dev(span1, "class", "form-slider");
    			add_location(span1, file$6, 98, 24, 3804);
    			attr_dev(label5, "class", "form-switch mx-auto");
    			add_location(label5, file$6, 96, 20, 3663);
    			attr_dev(div7, "class", "form-field");
    			add_location(div7, file$6, 94, 16, 3566);
    			attr_dev(div8, "class", "grix xs1 lg3 gutter-lg2");
    			add_location(div8, file$6, 85, 12, 3131);
    			add_location(form, file$6, 68, 8, 2287);
    			attr_dev(div9, "class", "modal-content container");
    			add_location(div9, file$6, 67, 4, 2241);
    			attr_dev(div10, "class", "btn btn-small rounded-1 primary mb-3");
    			add_location(div10, file$6, 112, 8, 4343);
    			attr_dev(div11, "class", "modal-footer w-100 text-center");
    			add_location(div11, file$6, 111, 4, 4290);
    			attr_dev(div12, "class", "modal shadow-1 white rounded-3");
    			attr_dev(div12, "id", "modal-share");
    			add_location(div12, file$6, 65, 0, 2119);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div0);
    			append_dev(div12, t1);
    			append_dev(div12, div9);
    			append_dev(div9, form);
    			append_dev(form, div4);
    			append_dev(div4, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t3);
    			append_dev(div2, input0);
    			set_input_value(input0, /*shPassword*/ ctx[6]);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t8);
    			append_dev(div3, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*profile*/ ctx[4]);
    			append_dev(form, t9);
    			append_dev(form, div8);
    			append_dev(div8, div6);
    			append_dev(div6, label2);
    			append_dev(div6, t11);
    			append_dev(div6, label3);
    			append_dev(label3, input1);
    			input1.checked = /*readOnly*/ ctx[5];
    			append_dev(label3, t12);
    			append_dev(label3, span0);
    			append_dev(label3, t13);
    			append_dev(div6, t14);
    			append_dev(div6, div5);
    			append_dev(div8, t16);
    			append_dev(div8, div7);
    			append_dev(div7, label4);
    			append_dev(div7, t18);
    			append_dev(div7, label5);
    			append_dev(label5, input2);
    			input2.checked = /*expires*/ ctx[3];
    			append_dev(label5, t19);
    			append_dev(label5, span1);
    			append_dev(label5, t20);
    			append_dev(div8, t21);
    			if (if_block0) if_block0.m(div8, null);
    			append_dev(div12, t22);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div11, t24);
    			if (if_block1) if_block1.m(div11, null);
    			append_dev(div11, t25);
    			if (if_block2) if_block2.m(div11, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[11]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[12]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[13]),
    					listen_dev(div10, "click", /*gen*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*shPassword*/ 64 && input0.value !== /*shPassword*/ ctx[6]) {
    				set_input_value(input0, /*shPassword*/ ctx[6]);
    			}

    			if (dirty & /*config*/ 1) {
    				each_value = /*config*/ ctx[0].sharing.profiles;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*profile*/ 16) {
    				select_option(select, /*profile*/ ctx[4]);
    			}

    			if (dirty & /*readOnly*/ 32) {
    				input1.checked = /*readOnly*/ ctx[5];
    			}

    			if (dirty & /*expires*/ 8) {
    				input2.checked = /*expires*/ ctx[3];
    			}

    			if (/*expires*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(div8, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!!/*error*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*error*/ 128) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div11, t25);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!!/*link*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*link*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div11, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let shPassword;
    	let readOnly;
    	let profile;
    	let expires;
    	let expiryDate;
    	let error;
    	let link;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sharing', slots, []);
    	let { dir } = $$props;
    	let { config } = $$props;
    	const dispatch = createEventDispatcher();

    	onMount(() => {
    		const modal = new Modal("#modal-share", { bodyScrolling: true });
    		const modalQuery = document.querySelector("#modal-share");

    		modalQuery.addEventListener("ax.modal.closed", function () {
    			destroy("#modal-share");
    			dispatch("closeShareModal");
    		});

    		modal.open();
    	});

    	async function gen(event) {
    		if (expires && !expiryDate) {
    			$$invalidate(7, error = "Please provide an expiry date");
    			return;
    		}

    		$$invalidate(7, error = "");

    		"shareLink?pwd=" + encodeURIComponent(shPassword) + "&dir=" + encodeURIComponent(dir) + "&readOnly=" + (readOnly ? "1" : "0") + "&profile=" + encodeURIComponent(config.sharing.profiles[profile]) + (expires
    		? "&expiry=" + encodeURIComponent(expiryDate)
    		: "");

    		$$invalidate(1, link = "Not implemented in the demo site");
    	}

    	const writable_props = ['dir', 'config'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sharing> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		shPassword = this.value;
    		$$invalidate(6, shPassword);
    	}

    	function select_change_handler() {
    		profile = select_value(this);
    		$$invalidate(4, profile);
    	}

    	function input1_change_handler() {
    		readOnly = this.checked;
    		$$invalidate(5, readOnly);
    	}

    	function input2_change_handler() {
    		expires = this.checked;
    		$$invalidate(3, expires);
    	}

    	function input_input_handler() {
    		expiryDate = this.value;
    		$$invalidate(2, expiryDate);
    	}

    	$$self.$$set = $$props => {
    		if ('dir' in $$props) $$invalidate(9, dir = $$props.dir);
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		fade,
    		Modal,
    		destroy,
    		dir,
    		config,
    		dispatch,
    		gen,
    		link,
    		expiryDate,
    		expires,
    		profile,
    		readOnly,
    		shPassword,
    		error
    	});

    	$$self.$inject_state = $$props => {
    		if ('dir' in $$props) $$invalidate(9, dir = $$props.dir);
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    		if ('link' in $$props) $$invalidate(1, link = $$props.link);
    		if ('expiryDate' in $$props) $$invalidate(2, expiryDate = $$props.expiryDate);
    		if ('expires' in $$props) $$invalidate(3, expires = $$props.expires);
    		if ('profile' in $$props) $$invalidate(4, profile = $$props.profile);
    		if ('readOnly' in $$props) $$invalidate(5, readOnly = $$props.readOnly);
    		if ('shPassword' in $$props) $$invalidate(6, shPassword = $$props.shPassword);
    		if ('error' in $$props) $$invalidate(7, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(6, shPassword = "");
    	$$invalidate(5, readOnly = true);
    	$$invalidate(4, profile = 0);
    	$$invalidate(3, expires = false);
    	$$invalidate(2, expiryDate = "");
    	$$invalidate(7, error = "");
    	$$invalidate(1, link = "");

    	return [
    		config,
    		link,
    		expiryDate,
    		expires,
    		profile,
    		readOnly,
    		shPassword,
    		error,
    		gen,
    		dir,
    		input0_input_handler,
    		select_change_handler,
    		input1_change_handler,
    		input2_change_handler,
    		input_input_handler
    	];
    }

    class Sharing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { dir: 9, config: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sharing",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*dir*/ ctx[9] === undefined && !('dir' in props)) {
    			console.warn("<Sharing> was created without expected prop 'dir'");
    		}

    		if (/*config*/ ctx[0] === undefined && !('config' in props)) {
    			console.warn("<Sharing> was created without expected prop 'config'");
    		}
    	}

    	get dir() {
    		throw new Error("<Sharing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dir(value) {
    		throw new Error("<Sharing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get config() {
    		throw new Error("<Sharing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<Sharing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconLogout.svelte generated by Svelte v3.49.0 */

    const file$5 = "src\\SVG\\IconLogout.svelte";

    function create_fragment$5(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z");
    			add_location(path, file$5, 12, 4, 352);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$5, 5, 0, 147);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconLogout', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconLogout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconLogout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconLogout",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconLogout> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconLogout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconLogout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconLogout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconLogout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconNight.svelte generated by Svelte v3.49.0 */

    const file$4 = "src\\SVG\\IconNight.svelte";

    function create_fragment$4(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M10,2C8.18,2 6.47,2.5 5,3.35C8,5.08 10,8.3 10,12C10,15.7 8,18.92 5,20.65C6.47,21.5 8.18,22 10,22A10,10 0 0,0 20,12A10,10 0 0,0 10,2Z");
    			add_location(path, file$4, 12, 4, 344);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$4, 5, 0, 139);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconNight', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconNight> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconNight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconNight",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconNight> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconNight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconNight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconNight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconNight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SVG\IconDay.svelte generated by Svelte v3.49.0 */

    const file$3 = "src\\SVG\\IconDay.svelte";

    function create_fragment$3(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z");
    			add_location(path, file$3, 12, 4, 344);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$3, 5, 0, 139);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				attr_dev(path, "fill", /*color*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconDay', slots, []);
    	let { size } = $$props;
    	let { color = "#000000" } = $$props;
    	const writable_props = ['size', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconDay> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color];
    }

    class IconDay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconDay",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[0] === undefined && !('size' in props)) {
    			console.warn("<IconDay> was created without expected prop 'size'");
    		}
    	}

    	get size() {
    		throw new Error("<IconDay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconDay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconDay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconDay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\FileManager\FileManager.svelte generated by Svelte v3.49.0 */

    const { console: console_1 } = globals;
    const file$2 = "src\\FileManager\\FileManager.svelte";

    // (172:8) {#if !!toPaste}
    function create_if_block_14(ctx) {
    	let div0;
    	let iconpaste;
    	let div0_transition;
    	let t;
    	let div1;
    	let iconunpaste;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;

    	iconpaste = new IconPaste({
    			props: { color: "#AA0000", size: 24 },
    			$$inline: true
    		});

    	iconunpaste = new IconUnpaste({
    			props: { color: "#AA0000", size: 24 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(iconpaste.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(iconunpaste.$$.fragment);
    			attr_dev(div0, "class", "navbar-link");
    			attr_dev(div0, "title", "Paste");
    			add_location(div0, file$2, 172, 12, 5341);
    			attr_dev(div1, "class", "navbar-link");
    			attr_dev(div1, "title", "Abort paste");
    			add_location(div1, file$2, 175, 12, 5502);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(iconpaste, div0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(iconunpaste, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*doPaste*/ ctx[12], false, false, false),
    					listen_dev(div1, "click", /*unmarkToPaste*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconpaste.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, {}, true);
    				div0_transition.run(1);
    			});

    			transition_in(iconunpaste.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconpaste.$$.fragment, local);
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, {}, false);
    			div0_transition.run(0);
    			transition_out(iconunpaste.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(iconpaste);
    			if (detaching && div0_transition) div0_transition.end();
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			destroy_component(iconunpaste);
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(172:8) {#if !!toPaste}",
    		ctx
    	});

    	return block;
    }

    // (181:8) {#if !config.readOnly}
    function create_if_block_13(ctx) {
    	let div0;
    	let iconnewfolder;
    	let t;
    	let div1;
    	let iconupload;
    	let current;
    	let mounted;
    	let dispose;
    	iconnewfolder = new IconNewFolder({ props: { size: 24 }, $$inline: true });
    	iconupload = new IconUpload({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(iconnewfolder.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(iconupload.$$.fragment);
    			attr_dev(div0, "class", "navbar-link");
    			attr_dev(div0, "title", "Create folder");
    			add_location(div0, file$2, 181, 12, 5748);
    			attr_dev(div1, "class", "navbar-link");
    			attr_dev(div1, "title", "Upload file(s)");
    			add_location(div1, file$2, 184, 12, 5891);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(iconnewfolder, div0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(iconupload, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*newFolder*/ ctx[16], false, false, false),
    					listen_dev(div1, "click", /*doUpload*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconnewfolder.$$.fragment, local);
    			transition_in(iconupload.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconnewfolder.$$.fragment, local);
    			transition_out(iconupload.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(iconnewfolder);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			destroy_component(iconupload);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(181:8) {#if !config.readOnly}",
    		ctx
    	});

    	return block;
    }

    // (189:8) {#if config.sharing != null}
    function create_if_block_12(ctx) {
    	let div;
    	let iconshare;
    	let current;
    	let mounted;
    	let dispose;
    	iconshare = new IconShare({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(iconshare.$$.fragment);
    			attr_dev(div, "class", "navbar-link");
    			attr_dev(div, "title", "Share link for this folder");
    			add_location(div, file$2, 189, 12, 6082);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(iconshare, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*doOpenSharingModal*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconshare.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconshare.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(iconshare);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(189:8) {#if config.sharing != null}",
    		ctx
    	});

    	return block;
    }

    // (200:12) {:else}
    function create_else_block_2(ctx) {
    	let iconlist;
    	let current;
    	iconlist = new IconList({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconlist, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(200:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (198:12) {#if mode == 'GRID'}
    function create_if_block_11(ctx) {
    	let icongrid;
    	let current;
    	icongrid = new IconGrid({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(icongrid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icongrid, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icongrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icongrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icongrid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(198:12) {#if mode == 'GRID'}",
    		ctx
    	});

    	return block;
    }

    // (207:12) {:else}
    function create_else_block_1(ctx) {
    	let iconday;
    	let current;
    	iconday = new IconDay({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconday.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconday, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconday.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconday.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconday, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(207:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (205:12) {#if darkTheme}
    function create_if_block_10(ctx) {
    	let iconnight;
    	let current;
    	iconnight = new IconNight({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconnight.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconnight, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconnight.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconnight.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconnight, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(205:12) {#if darkTheme}",
    		ctx
    	});

    	return block;
    }

    // (223:54) 
    function create_if_block_9(ctx) {
    	let iconsortsizedesc;
    	let current;
    	iconsortsizedesc = new IconSortSizeDesc({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconsortsizedesc.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconsortsizedesc, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconsortsizedesc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconsortsizedesc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconsortsizedesc, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(223:54) ",
    		ctx
    	});

    	return block;
    }

    // (221:55) 
    function create_if_block_8(ctx) {
    	let iconsortsizeasc;
    	let current;
    	iconsortsizeasc = new IconSortSizeAsc({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconsortsizeasc.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconsortsizeasc, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconsortsizeasc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconsortsizeasc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconsortsizeasc, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(221:55) ",
    		ctx
    	});

    	return block;
    }

    // (219:52) 
    function create_if_block_7(ctx) {
    	let iconsortdatedesc;
    	let current;
    	iconsortdatedesc = new IconSortDateDesc({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconsortdatedesc.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconsortdatedesc, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconsortdatedesc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconsortdatedesc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconsortdatedesc, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(219:52) ",
    		ctx
    	});

    	return block;
    }

    // (217:53) 
    function create_if_block_6(ctx) {
    	let iconsortdateasc;
    	let current;
    	iconsortdateasc = new IconSortDateAsc({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconsortdateasc.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconsortdateasc, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconsortdateasc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconsortdateasc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconsortdateasc, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(217:53) ",
    		ctx
    	});

    	return block;
    }

    // (215:48) 
    function create_if_block_5(ctx) {
    	let iconsortalphdesc;
    	let current;
    	iconsortalphdesc = new IconSortAlphDesc({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconsortalphdesc.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconsortalphdesc, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconsortalphdesc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconsortalphdesc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconsortalphdesc, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(215:48) ",
    		ctx
    	});

    	return block;
    }

    // (213:16) {#if sorter == SORTERS.ABC}
    function create_if_block_4(ctx) {
    	let iconsortalphasc;
    	let current;
    	iconsortalphasc = new IconSortAlphAsc({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconsortalphasc.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconsortalphasc, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconsortalphasc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconsortalphasc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconsortalphasc, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(213:16) {#if sorter == SORTERS.ABC}",
    		ctx
    	});

    	return block;
    }

    // (254:8) {#if config.hasPassword}
    function create_if_block_3(ctx) {
    	let div;
    	let iconlogout;
    	let current;
    	let mounted;
    	let dispose;
    	iconlogout = new IconLogout({ props: { size: 24 }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(iconlogout.$$.fragment);
    			attr_dev(div, "class", "navbar-link");
    			attr_dev(div, "title", "Log out");
    			add_location(div, file$2, 254, 12, 9264);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(iconlogout, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*logout*/ ctx[23], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconlogout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconlogout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(iconlogout);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(254:8) {#if config.hasPassword}",
    		ctx
    	});

    	return block;
    }

    // (263:0) {:else}
    function create_else_block$2(ctx) {
    	let list;
    	let updating_sorter;
    	let current;

    	function list_sorter_binding(value) {
    		/*list_sorter_binding*/ ctx[27](value);
    	}

    	let list_props = { itemList: /*mule*/ ctx[3].items };

    	if (/*sorter*/ ctx[1] !== void 0) {
    		list_props.sorter = /*sorter*/ ctx[1];
    	}

    	list = new List({ props: list_props, $$inline: true });
    	binding_callbacks.push(() => bind(list, 'sorter', list_sorter_binding));
    	list.$on("openItem", /*click*/ ctx[9]);
    	list.$on("reload", /*reload_handler_1*/ ctx[28]);
    	list.$on("openPropsModal", /*doOpenPropsModal*/ ctx[19]);

    	const block = {
    		c: function create() {
    			create_component(list.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(list, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const list_changes = {};
    			if (dirty[0] & /*mule*/ 8) list_changes.itemList = /*mule*/ ctx[3].items;

    			if (!updating_sorter && dirty[0] & /*sorter*/ 2) {
    				updating_sorter = true;
    				list_changes.sorter = /*sorter*/ ctx[1];
    				add_flush_callback(() => updating_sorter = false);
    			}

    			list.$set(list_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(list.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(list.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(list, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(263:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (261:0) {#if mode == 'GRID'}
    function create_if_block_2(ctx) {
    	let grid;
    	let current;

    	grid = new Grid({
    			props: { itemList: /*mule*/ ctx[3].items },
    			$$inline: true
    		});

    	grid.$on("openItem", /*click*/ ctx[9]);
    	grid.$on("reload", /*reload_handler*/ ctx[26]);
    	grid.$on("openPropsModal", /*doOpenPropsModal*/ ctx[19]);

    	const block = {
    		c: function create() {
    			create_component(grid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid_changes = {};
    			if (dirty[0] & /*mule*/ 8) grid_changes.itemList = /*mule*/ ctx[3].items;
    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(261:0) {#if mode == 'GRID'}",
    		ctx
    	});

    	return block;
    }

    // (269:0) {#if propForFile != null}
    function create_if_block_1$1(ctx) {
    	let properties;
    	let updating_item;
    	let current;

    	function properties_item_binding(value) {
    		/*properties_item_binding*/ ctx[29](value);
    	}

    	let properties_props = { readOnly: /*config*/ ctx[4].readOnly };

    	if (/*propForFile*/ ctx[7] !== void 0) {
    		properties_props.item = /*propForFile*/ ctx[7];
    	}

    	properties = new Properties({ props: properties_props, $$inline: true });
    	binding_callbacks.push(() => bind(properties, 'item', properties_item_binding));
    	properties.$on("toPaste", /*markToPaste*/ ctx[10]);
    	properties.$on("closePropsModal", /*doClosePropsModal*/ ctx[20]);

    	const block = {
    		c: function create() {
    			create_component(properties.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(properties, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const properties_changes = {};
    			if (dirty[0] & /*config*/ 16) properties_changes.readOnly = /*config*/ ctx[4].readOnly;

    			if (!updating_item && dirty[0] & /*propForFile*/ 128) {
    				updating_item = true;
    				properties_changes.item = /*propForFile*/ ctx[7];
    				add_flush_callback(() => updating_item = false);
    			}

    			properties.$set(properties_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(properties.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(properties.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(properties, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(269:0) {#if propForFile != null}",
    		ctx
    	});

    	return block;
    }

    // (273:0) {#if sharingOpen}
    function create_if_block$2(ctx) {
    	let sharing;
    	let current;

    	sharing = new Sharing({
    			props: {
    				dir: /*path*/ ctx[0].join("") + "/",
    				config: /*config*/ ctx[4]
    			},
    			$$inline: true
    		});

    	sharing.$on("closeShareModal", /*doCloseSharingModal*/ ctx[22]);

    	const block = {
    		c: function create() {
    			create_component(sharing.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sharing, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sharing_changes = {};
    			if (dirty[0] & /*path*/ 1) sharing_changes.dir = /*path*/ ctx[0].join("") + "/";
    			if (dirty[0] & /*config*/ 16) sharing_changes.config = /*config*/ ctx[4];
    			sharing.$set(sharing_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sharing.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sharing.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sharing, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(273:0) {#if sharingOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let nav;
    	let breadcrumb;
    	let updating_path;
    	let t0;
    	let div13;
    	let t1;
    	let div0;
    	let t3;
    	let t4;
    	let t5;
    	let div1;
    	let iconreload;
    	let t6;
    	let div2;
    	let current_block_type_index;
    	let if_block3;
    	let t7;
    	let div3;
    	let current_block_type_index_1;
    	let if_block4;
    	let t8;
    	let div12;
    	let div4;
    	let current_block_type_index_2;
    	let if_block5;
    	let t9;
    	let div11;
    	let div5;
    	let iconsortalphasc;
    	let t10;
    	let div6;
    	let iconsortalphdesc;
    	let t11;
    	let div7;
    	let iconsortdateasc;
    	let t12;
    	let div8;
    	let iconsortdatedesc;
    	let t13;
    	let div9;
    	let iconsortsizeasc;
    	let t14;
    	let div10;
    	let iconsortsizedesc;
    	let t15;
    	let t16;
    	let current_block_type_index_3;
    	let if_block7;
    	let t17;
    	let div14;
    	let t19;
    	let div15;
    	let t21;
    	let div16;
    	let t23;
    	let t24;
    	let if_block9_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	function breadcrumb_path_binding(value) {
    		/*breadcrumb_path_binding*/ ctx[24](value);
    	}

    	let breadcrumb_props = {};

    	if (/*path*/ ctx[0] !== void 0) {
    		breadcrumb_props.path = /*path*/ ctx[0];
    	}

    	breadcrumb = new Breadcrumb({ props: breadcrumb_props, $$inline: true });
    	binding_callbacks.push(() => bind(breadcrumb, 'path', breadcrumb_path_binding));
    	breadcrumb.$on("pathEvent", /*pathEvent_handler*/ ctx[25]);
    	let if_block0 = !!/*toPaste*/ ctx[8] && create_if_block_14(ctx);
    	let if_block1 = !/*config*/ ctx[4].readOnly && create_if_block_13(ctx);
    	let if_block2 = /*config*/ ctx[4].sharing != null && create_if_block_12(ctx);
    	iconreload = new IconReload({ props: { size: 24 }, $$inline: true });
    	const if_block_creators = [create_if_block_11, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*mode*/ ctx[2] == 'GRID') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block_10, create_else_block_1];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*darkTheme*/ ctx[5]) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block4 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);

    	const if_block_creators_2 = [
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7,
    		create_if_block_8,
    		create_if_block_9
    	];

    	const if_blocks_2 = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*sorter*/ ctx[1] == SORTERS.ABC) return 0;
    		if (/*sorter*/ ctx[1] == SORTERS.CBA) return 1;
    		if (/*sorter*/ ctx[1] == SORTERS.OldFirst) return 2;
    		if (/*sorter*/ ctx[1] == SORTERS.OldLast) return 3;
    		if (/*sorter*/ ctx[1] == SORTERS.SmallFirst) return 4;
    		if (/*sorter*/ ctx[1] == SORTERS.SmallLast) return 5;
    		return -1;
    	}

    	if (~(current_block_type_index_2 = select_block_type_2(ctx))) {
    		if_block5 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
    	}

    	iconsortalphasc = new IconSortAlphAsc({ props: { size: 24 }, $$inline: true });
    	iconsortalphdesc = new IconSortAlphDesc({ props: { size: 24 }, $$inline: true });
    	iconsortdateasc = new IconSortDateAsc({ props: { size: 24 }, $$inline: true });
    	iconsortdatedesc = new IconSortDateDesc({ props: { size: 24 }, $$inline: true });
    	iconsortsizeasc = new IconSortSizeAsc({ props: { size: 24 }, $$inline: true });
    	iconsortsizedesc = new IconSortSizeDesc({ props: { size: 24 }, $$inline: true });
    	let if_block6 = /*config*/ ctx[4].hasPassword && create_if_block_3(ctx);
    	const if_block_creators_3 = [create_if_block_2, create_else_block$2];
    	const if_blocks_3 = [];

    	function select_block_type_3(ctx, dirty) {
    		if (/*mode*/ ctx[2] == 'GRID') return 0;
    		return 1;
    	}

    	current_block_type_index_3 = select_block_type_3(ctx);
    	if_block7 = if_blocks_3[current_block_type_index_3] = if_block_creators_3[current_block_type_index_3](ctx);
    	let if_block8 = /*propForFile*/ ctx[7] != null && create_if_block_1$1(ctx);
    	let if_block9 = /*sharingOpen*/ ctx[6] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			create_component(breadcrumb.$$.fragment);
    			t0 = space();
    			div13 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = " ";
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			t5 = space();
    			div1 = element("div");
    			create_component(iconreload.$$.fragment);
    			t6 = space();
    			div2 = element("div");
    			if_block3.c();
    			t7 = space();
    			div3 = element("div");
    			if_block4.c();
    			t8 = space();
    			div12 = element("div");
    			div4 = element("div");
    			if (if_block5) if_block5.c();
    			t9 = space();
    			div11 = element("div");
    			div5 = element("div");
    			create_component(iconsortalphasc.$$.fragment);
    			t10 = space();
    			div6 = element("div");
    			create_component(iconsortalphdesc.$$.fragment);
    			t11 = space();
    			div7 = element("div");
    			create_component(iconsortdateasc.$$.fragment);
    			t12 = space();
    			div8 = element("div");
    			create_component(iconsortdatedesc.$$.fragment);
    			t13 = space();
    			div9 = element("div");
    			create_component(iconsortsizeasc.$$.fragment);
    			t14 = space();
    			div10 = element("div");
    			create_component(iconsortsizedesc.$$.fragment);
    			t15 = space();
    			if (if_block6) if_block6.c();
    			t16 = space();
    			if_block7.c();
    			t17 = space();
    			div14 = element("div");
    			div14.textContent = " ";
    			t19 = space();
    			div15 = element("div");
    			div15.textContent = " ";
    			t21 = space();
    			div16 = element("div");
    			div16.textContent = " ";
    			t23 = space();
    			if (if_block8) if_block8.c();
    			t24 = space();
    			if (if_block9) if_block9.c();
    			if_block9_anchor = empty();
    			add_location(div0, file$2, 179, 8, 5687);
    			attr_dev(div1, "class", "navbar-link");
    			attr_dev(div1, "title", "Reload file list");
    			add_location(div1, file$2, 193, 8, 6253);
    			attr_dev(div2, "class", "navbar-link");
    			attr_dev(div2, "title", "View mode");
    			add_location(div2, file$2, 196, 8, 6381);
    			attr_dev(div3, "class", "navbar-link");
    			attr_dev(div3, "title", "Theme");
    			add_location(div3, file$2, 203, 8, 6617);
    			attr_dev(div4, "class", "navbar-link");
    			attr_dev(div4, "data-target", "SortBy");
    			attr_dev(div4, "title", "Sort by");
    			set_style(div4, "height", "40px");
    			add_location(div4, file$2, 211, 12, 6892);
    			attr_dev(div5, "class", "dropdown-item");
    			attr_dev(div5, "title", "Sort alphabetically, ascending");
    			toggle_class(div5, "active", /*sorter*/ ctx[1] == SORTERS.ABC);
    			add_location(div5, file$2, 227, 16, 7715);
    			attr_dev(div6, "class", "dropdown-item");
    			attr_dev(div6, "title", "Sort alphabetically, descending");
    			toggle_class(div6, "active", /*sorter*/ ctx[1] == SORTERS.CBA);
    			add_location(div6, file$2, 231, 16, 7959);
    			attr_dev(div7, "class", "dropdown-item");
    			attr_dev(div7, "title", "Sort by date, ascending");
    			toggle_class(div7, "active", /*sorter*/ ctx[1] == SORTERS.OldFirst);
    			add_location(div7, file$2, 235, 16, 8205);
    			attr_dev(div8, "class", "dropdown-item");
    			attr_dev(div8, "title", "Sort by date, descending");
    			toggle_class(div8, "active", /*sorter*/ ctx[1] == SORTERS.OldLast);
    			add_location(div8, file$2, 239, 16, 8452);
    			attr_dev(div9, "class", "dropdown-item");
    			attr_dev(div9, "title", "Sort by size, ascending");
    			toggle_class(div9, "active", /*sorter*/ ctx[1] == SORTERS.SmallFirst);
    			add_location(div9, file$2, 243, 16, 8699);
    			attr_dev(div10, "class", "dropdown-item");
    			attr_dev(div10, "title", "Sort by size, descending");
    			toggle_class(div10, "active", /*sorter*/ ctx[1] == SORTERS.SmallLast);
    			add_location(div10, file$2, 247, 16, 8950);
    			attr_dev(div11, "class", "dropdown-content dropdown-right white shadow-1");
    			add_location(div11, file$2, 226, 12, 7638);
    			attr_dev(div12, "class", "dropdown");
    			attr_dev(div12, "id", "SortBy");
    			add_location(div12, file$2, 210, 8, 6845);
    			attr_dev(div13, "class", "navbar-menu ml-auto");
    			set_style(div13, "height", "40px");
    			add_location(div13, file$2, 170, 4, 5249);
    			attr_dev(nav, "class", "navbar");
    			set_style(nav, "height", "40px");
    			add_location(nav, file$2, 168, 0, 5161);
    			add_location(div14, file$2, 265, 0, 9664);
    			add_location(div15, file$2, 266, 0, 9682);
    			add_location(div16, file$2, 267, 0, 9700);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			mount_component(breadcrumb, nav, null);
    			append_dev(nav, t0);
    			append_dev(nav, div13);
    			if (if_block0) if_block0.m(div13, null);
    			append_dev(div13, t1);
    			append_dev(div13, div0);
    			append_dev(div13, t3);
    			if (if_block1) if_block1.m(div13, null);
    			append_dev(div13, t4);
    			if (if_block2) if_block2.m(div13, null);
    			append_dev(div13, t5);
    			append_dev(div13, div1);
    			mount_component(iconreload, div1, null);
    			append_dev(div13, t6);
    			append_dev(div13, div2);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div13, t7);
    			append_dev(div13, div3);
    			if_blocks_1[current_block_type_index_1].m(div3, null);
    			append_dev(div13, t8);
    			append_dev(div13, div12);
    			append_dev(div12, div4);

    			if (~current_block_type_index_2) {
    				if_blocks_2[current_block_type_index_2].m(div4, null);
    			}

    			append_dev(div12, t9);
    			append_dev(div12, div11);
    			append_dev(div11, div5);
    			mount_component(iconsortalphasc, div5, null);
    			append_dev(div11, t10);
    			append_dev(div11, div6);
    			mount_component(iconsortalphdesc, div6, null);
    			append_dev(div11, t11);
    			append_dev(div11, div7);
    			mount_component(iconsortdateasc, div7, null);
    			append_dev(div11, t12);
    			append_dev(div11, div8);
    			mount_component(iconsortdatedesc, div8, null);
    			append_dev(div11, t13);
    			append_dev(div11, div9);
    			mount_component(iconsortsizeasc, div9, null);
    			append_dev(div11, t14);
    			append_dev(div11, div10);
    			mount_component(iconsortsizedesc, div10, null);
    			append_dev(div13, t15);
    			if (if_block6) if_block6.m(div13, null);
    			insert_dev(target, t16, anchor);
    			if_blocks_3[current_block_type_index_3].m(target, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, div14, anchor);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, div15, anchor);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, div16, anchor);
    			insert_dev(target, t23, anchor);
    			if (if_block8) if_block8.m(target, anchor);
    			insert_dev(target, t24, anchor);
    			if (if_block9) if_block9.m(target, anchor);
    			insert_dev(target, if_block9_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*reload*/ ctx[18], false, false, false),
    					listen_dev(div2, "click", /*gridOrList*/ ctx[14], false, false, false),
    					listen_dev(div3, "click", /*lightOrDark*/ ctx[15], false, false, false),
    					listen_dev(div5, "click", /*resort*/ ctx[13](SORTERS.ABC), false, false, false),
    					listen_dev(div6, "click", /*resort*/ ctx[13](SORTERS.CBA), false, false, false),
    					listen_dev(div7, "click", /*resort*/ ctx[13](SORTERS.OldFirst), false, false, false),
    					listen_dev(div8, "click", /*resort*/ ctx[13](SORTERS.OldLast), false, false, false),
    					listen_dev(div9, "click", /*resort*/ ctx[13](SORTERS.SmallFirst), false, false, false),
    					listen_dev(div10, "click", /*resort*/ ctx[13](SORTERS.SmallLast), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumb_changes = {};

    			if (!updating_path && dirty[0] & /*path*/ 1) {
    				updating_path = true;
    				breadcrumb_changes.path = /*path*/ ctx[0];
    				add_flush_callback(() => updating_path = false);
    			}

    			breadcrumb.$set(breadcrumb_changes);

    			if (!!/*toPaste*/ ctx[8]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*toPaste*/ 256) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_14(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div13, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*config*/ ctx[4].readOnly) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*config*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_13(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div13, t4);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*config*/ ctx[4].sharing != null) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*config*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_12(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div13, t5);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block3 = if_blocks[current_block_type_index];

    				if (!if_block3) {
    					if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block3.c();
    				}

    				transition_in(if_block3, 1);
    				if_block3.m(div2, null);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 !== previous_block_index_1) {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block4 = if_blocks_1[current_block_type_index_1];

    				if (!if_block4) {
    					if_block4 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block4.c();
    				}

    				transition_in(if_block4, 1);
    				if_block4.m(div3, null);
    			}

    			let previous_block_index_2 = current_block_type_index_2;
    			current_block_type_index_2 = select_block_type_2(ctx);

    			if (current_block_type_index_2 !== previous_block_index_2) {
    				if (if_block5) {
    					group_outros();

    					transition_out(if_blocks_2[previous_block_index_2], 1, 1, () => {
    						if_blocks_2[previous_block_index_2] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index_2) {
    					if_block5 = if_blocks_2[current_block_type_index_2];

    					if (!if_block5) {
    						if_block5 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
    						if_block5.c();
    					}

    					transition_in(if_block5, 1);
    					if_block5.m(div4, null);
    				} else {
    					if_block5 = null;
    				}
    			}

    			if (dirty[0] & /*sorter*/ 2) {
    				toggle_class(div5, "active", /*sorter*/ ctx[1] == SORTERS.ABC);
    			}

    			if (dirty[0] & /*sorter*/ 2) {
    				toggle_class(div6, "active", /*sorter*/ ctx[1] == SORTERS.CBA);
    			}

    			if (dirty[0] & /*sorter*/ 2) {
    				toggle_class(div7, "active", /*sorter*/ ctx[1] == SORTERS.OldFirst);
    			}

    			if (dirty[0] & /*sorter*/ 2) {
    				toggle_class(div8, "active", /*sorter*/ ctx[1] == SORTERS.OldLast);
    			}

    			if (dirty[0] & /*sorter*/ 2) {
    				toggle_class(div9, "active", /*sorter*/ ctx[1] == SORTERS.SmallFirst);
    			}

    			if (dirty[0] & /*sorter*/ 2) {
    				toggle_class(div10, "active", /*sorter*/ ctx[1] == SORTERS.SmallLast);
    			}

    			if (/*config*/ ctx[4].hasPassword) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);

    					if (dirty[0] & /*config*/ 16) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block_3(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(div13, null);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index_3 = current_block_type_index_3;
    			current_block_type_index_3 = select_block_type_3(ctx);

    			if (current_block_type_index_3 === previous_block_index_3) {
    				if_blocks_3[current_block_type_index_3].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_3[previous_block_index_3], 1, 1, () => {
    					if_blocks_3[previous_block_index_3] = null;
    				});

    				check_outros();
    				if_block7 = if_blocks_3[current_block_type_index_3];

    				if (!if_block7) {
    					if_block7 = if_blocks_3[current_block_type_index_3] = if_block_creators_3[current_block_type_index_3](ctx);
    					if_block7.c();
    				} else {
    					if_block7.p(ctx, dirty);
    				}

    				transition_in(if_block7, 1);
    				if_block7.m(t17.parentNode, t17);
    			}

    			if (/*propForFile*/ ctx[7] != null) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);

    					if (dirty[0] & /*propForFile*/ 128) {
    						transition_in(if_block8, 1);
    					}
    				} else {
    					if_block8 = create_if_block_1$1(ctx);
    					if_block8.c();
    					transition_in(if_block8, 1);
    					if_block8.m(t24.parentNode, t24);
    				}
    			} else if (if_block8) {
    				group_outros();

    				transition_out(if_block8, 1, 1, () => {
    					if_block8 = null;
    				});

    				check_outros();
    			}

    			if (/*sharingOpen*/ ctx[6]) {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);

    					if (dirty[0] & /*sharingOpen*/ 64) {
    						transition_in(if_block9, 1);
    					}
    				} else {
    					if_block9 = create_if_block$2(ctx);
    					if_block9.c();
    					transition_in(if_block9, 1);
    					if_block9.m(if_block9_anchor.parentNode, if_block9_anchor);
    				}
    			} else if (if_block9) {
    				group_outros();

    				transition_out(if_block9, 1, 1, () => {
    					if_block9 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumb.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(iconreload.$$.fragment, local);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			transition_in(iconsortalphasc.$$.fragment, local);
    			transition_in(iconsortalphdesc.$$.fragment, local);
    			transition_in(iconsortdateasc.$$.fragment, local);
    			transition_in(iconsortdatedesc.$$.fragment, local);
    			transition_in(iconsortsizeasc.$$.fragment, local);
    			transition_in(iconsortsizedesc.$$.fragment, local);
    			transition_in(if_block6);
    			transition_in(if_block7);
    			transition_in(if_block8);
    			transition_in(if_block9);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumb.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(iconreload.$$.fragment, local);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(iconsortalphasc.$$.fragment, local);
    			transition_out(iconsortalphdesc.$$.fragment, local);
    			transition_out(iconsortdateasc.$$.fragment, local);
    			transition_out(iconsortdatedesc.$$.fragment, local);
    			transition_out(iconsortsizeasc.$$.fragment, local);
    			transition_out(iconsortsizedesc.$$.fragment, local);
    			transition_out(if_block6);
    			transition_out(if_block7);
    			transition_out(if_block8);
    			transition_out(if_block9);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(breadcrumb);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_component(iconreload);
    			if_blocks[current_block_type_index].d();
    			if_blocks_1[current_block_type_index_1].d();

    			if (~current_block_type_index_2) {
    				if_blocks_2[current_block_type_index_2].d();
    			}

    			destroy_component(iconsortalphasc);
    			destroy_component(iconsortalphdesc);
    			destroy_component(iconsortdateasc);
    			destroy_component(iconsortdatedesc);
    			destroy_component(iconsortsizeasc);
    			destroy_component(iconsortsizedesc);
    			if (if_block6) if_block6.d();
    			if (detaching) detach_dev(t16);
    			if_blocks_3[current_block_type_index_3].d(detaching);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(div14);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(div15);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(div16);
    			if (detaching) detach_dev(t23);
    			if (if_block8) if_block8.d(detaching);
    			if (detaching) detach_dev(t24);
    			if (if_block9) if_block9.d(detaching);
    			if (detaching) detach_dev(if_block9_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let toPaste;
    	let isCut;
    	let propForFile;
    	let sharingOpen;
    	let darkTheme;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileManager', slots, []);
    	let { path } = $$props;
    	let { mule } = $$props;
    	let { sorter } = $$props;
    	let { mode } = $$props;
    	let { config } = $$props;
    	const dispatch = createEventDispatcher();

    	onMount(() => {
    		theme$1.enable();
    		resort(SORTERS.ABC)();
    		new Dropdown("#SortBy");

    		document.addEventListener('ax.theme.change', function () {
    			console.log(theme$1.theme);
    		});
    	});

    	onDestroy(() => {
    		destroy("#SortBy");
    	});

    	function click(event) {
    		const file = mule.items.find(i => i.uuid == event.detail.uuid);

    		if (file.isDir) {
    			// cd
    			let nuPath = path;

    			if (file.name == "../") nuPath = nuPath.slice(0, nuPath.length - 1); else nuPath = [...nuPath, file.name];
    			dispatch("pathEvent", { path: nuPath });
    		} else {
    			dispatch("openItem", event.detail);
    		}
    	}

    	function markToPaste(event) {
    		$$invalidate(8, toPaste = event.detail.file);
    		isCut = event.detail.isCut;
    	}

    	function unmarkToPaste() {
    		$$invalidate(8, toPaste = null);
    		isCut = false;
    	}

    	async function doPaste() {
    		await sweetalert2_all.fire({
    			icon: "warning",
    			text: "Not implemented in the demo site",
    			confirmButtonColor: "#0a6bb8"
    		});

    		unmarkToPaste();
    	}

    	function resort(_sorter) {
    		return function () {
    			$$invalidate(1, sorter = _sorter);
    		};
    	}

    	function gridOrList() {
    		$$invalidate(2, mode = mode == "GRID" ? "LIST" : "GRID");
    	}

    	function lightOrDark() {
    		$$invalidate(5, darkTheme = !darkTheme);
    	}

    	async function newFolder() {
    		const { value: name } = await sweetalert2_all.fire({
    			titleText: "Enter folder name",
    			confirmButtonColor: "#0a6bb8",
    			showCancelButton: true,
    			input: "text",
    			inputAttributes: {
    				autocapitalize: "off",
    				autocorrect: "off"
    			}
    		});

    		if (!name) {
    			return;
    		}

    		await sweetalert2_all.fire({
    			icon: "warning",
    			text: "Not implemented in the demo site",
    			confirmButtonColor: "#0a6bb8"
    		});
    	}

    	async function doUpload() {
    		const { value: file } = await sweetalert2_all.fire({
    			titleText: "Select files",
    			confirmButtonColor: "#0a6bb8",
    			showCancelButton: true,
    			input: "file"
    		});

    		if (!file) return;

    		await sweetalert2_all.fire({
    			icon: "warning",
    			text: "Not implemented in the demo site",
    			confirmButtonColor: "#0a6bb8"
    		});
    	}

    	function reload() {
    		dispatch("reload", {});
    	}

    	function doOpenPropsModal(event) {
    		$$invalidate(7, propForFile = event.detail.file);
    	}

    	function doClosePropsModal(event) {
    		$$invalidate(7, propForFile = null);
    		reload();
    	}

    	function doOpenSharingModal(event) {
    		$$invalidate(6, sharingOpen = true);
    	}

    	function doCloseSharingModal(event) {
    		$$invalidate(6, sharingOpen = false);
    	}

    	function logout() {
    		dispatch("logout", {});
    	}

    	const writable_props = ['path', 'mule', 'sorter', 'mode', 'config'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<FileManager> was created with unknown prop '${key}'`);
    	});

    	function breadcrumb_path_binding(value) {
    		path = value;
    		$$invalidate(0, path);
    	}

    	function pathEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function reload_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function list_sorter_binding(value) {
    		sorter = value;
    		$$invalidate(1, sorter);
    	}

    	function reload_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function properties_item_binding(value) {
    		propForFile = value;
    		$$invalidate(7, propForFile);
    	}

    	$$self.$$set = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    		if ('mule' in $$props) $$invalidate(3, mule = $$props.mule);
    		if ('sorter' in $$props) $$invalidate(1, sorter = $$props.sorter);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    		if ('config' in $$props) $$invalidate(4, config = $$props.config);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		onMount,
    		fade,
    		destroy,
    		Dropdown,
    		Theme: theme$1,
    		Swal: sweetalert2_all,
    		Breadcrumb,
    		Grid,
    		List,
    		SORTERS,
    		IconGrid,
    		IconList,
    		IconSortAlphAsc,
    		IconSortAlphDesc,
    		IconSortDateAsc,
    		IconSortDateDesc,
    		IconSortSizeAsc,
    		IconSortSizeDesc,
    		IconPaste,
    		IconUnpaste,
    		IconNewFolder,
    		IconUpload,
    		IconReload,
    		IconShare,
    		Properties,
    		Sharing,
    		IconLogout,
    		IconNight,
    		IconDay,
    		path,
    		mule,
    		sorter,
    		mode,
    		config,
    		dispatch,
    		click,
    		markToPaste,
    		unmarkToPaste,
    		doPaste,
    		resort,
    		gridOrList,
    		lightOrDark,
    		newFolder,
    		doUpload,
    		reload,
    		doOpenPropsModal,
    		doClosePropsModal,
    		doOpenSharingModal,
    		doCloseSharingModal,
    		logout,
    		sharingOpen,
    		propForFile,
    		darkTheme,
    		isCut,
    		toPaste
    	});

    	$$self.$inject_state = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    		if ('mule' in $$props) $$invalidate(3, mule = $$props.mule);
    		if ('sorter' in $$props) $$invalidate(1, sorter = $$props.sorter);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    		if ('config' in $$props) $$invalidate(4, config = $$props.config);
    		if ('sharingOpen' in $$props) $$invalidate(6, sharingOpen = $$props.sharingOpen);
    		if ('propForFile' in $$props) $$invalidate(7, propForFile = $$props.propForFile);
    		if ('darkTheme' in $$props) $$invalidate(5, darkTheme = $$props.darkTheme);
    		if ('isCut' in $$props) isCut = $$props.isCut;
    		if ('toPaste' in $$props) $$invalidate(8, toPaste = $$props.toPaste);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*darkTheme*/ 32) {
    			{
    				console.log(darkTheme);
    				theme$1.toggle(darkTheme ? 'dark' : 'light');
    			}
    		}
    	};

    	$$invalidate(8, toPaste = null);
    	isCut = false;
    	$$invalidate(7, propForFile = null);
    	$$invalidate(6, sharingOpen = false);
    	$$invalidate(5, darkTheme = false);

    	return [
    		path,
    		sorter,
    		mode,
    		mule,
    		config,
    		darkTheme,
    		sharingOpen,
    		propForFile,
    		toPaste,
    		click,
    		markToPaste,
    		unmarkToPaste,
    		doPaste,
    		resort,
    		gridOrList,
    		lightOrDark,
    		newFolder,
    		doUpload,
    		reload,
    		doOpenPropsModal,
    		doClosePropsModal,
    		doOpenSharingModal,
    		doCloseSharingModal,
    		logout,
    		breadcrumb_path_binding,
    		pathEvent_handler,
    		reload_handler,
    		list_sorter_binding,
    		reload_handler_1,
    		properties_item_binding
    	];
    }

    class FileManager extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				path: 0,
    				mule: 3,
    				sorter: 1,
    				mode: 2,
    				config: 4
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileManager",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*path*/ ctx[0] === undefined && !('path' in props)) {
    			console_1.warn("<FileManager> was created without expected prop 'path'");
    		}

    		if (/*mule*/ ctx[3] === undefined && !('mule' in props)) {
    			console_1.warn("<FileManager> was created without expected prop 'mule'");
    		}

    		if (/*sorter*/ ctx[1] === undefined && !('sorter' in props)) {
    			console_1.warn("<FileManager> was created without expected prop 'sorter'");
    		}

    		if (/*mode*/ ctx[2] === undefined && !('mode' in props)) {
    			console_1.warn("<FileManager> was created without expected prop 'mode'");
    		}

    		if (/*config*/ ctx[4] === undefined && !('config' in props)) {
    			console_1.warn("<FileManager> was created without expected prop 'config'");
    		}
    	}

    	get path() {
    		throw new Error("<FileManager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<FileManager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mule() {
    		throw new Error("<FileManager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mule(value) {
    		throw new Error("<FileManager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sorter() {
    		throw new Error("<FileManager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sorter(value) {
    		throw new Error("<FileManager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mode() {
    		throw new Error("<FileManager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<FileManager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get config() {
    		throw new Error("<FileManager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<FileManager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */
    const file$1 = "src\\App.svelte";

    // (144:4) {:else}
    function create_else_block$1(ctx) {
    	let preview;
    	let current;

    	preview = new Preview({
    			props: {
    				files: /*mule*/ ctx[1].files,
    				fileIdx: /*slideshowIndex*/ ctx[4]
    			},
    			$$inline: true
    		});

    	preview.$on("closePreview", /*closeSlideshow*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(preview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(preview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const preview_changes = {};
    			if (dirty & /*mule*/ 2) preview_changes.files = /*mule*/ ctx[1].files;
    			if (dirty & /*slideshowIndex*/ 16) preview_changes.fileIdx = /*slideshowIndex*/ ctx[4];
    			preview.$set(preview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(preview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(preview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(preview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(144:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (134:4) {#if slideshowIndex < 0}
    function create_if_block$1(ctx) {
    	let nav;
    	let p;
    	let t0_value = /*config*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let filemanager;
    	let updating_path;
    	let updating_mule;
    	let updating_sorter;
    	let updating_mode;
    	let t2;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	function filemanager_path_binding(value) {
    		/*filemanager_path_binding*/ ctx[12](value);
    	}

    	function filemanager_mule_binding(value) {
    		/*filemanager_mule_binding*/ ctx[13](value);
    	}

    	function filemanager_sorter_binding(value) {
    		/*filemanager_sorter_binding*/ ctx[14](value);
    	}

    	function filemanager_mode_binding(value) {
    		/*filemanager_mode_binding*/ ctx[15](value);
    	}

    	let filemanager_props = { config: /*config*/ ctx[0] };

    	if (/*path*/ ctx[3] !== void 0) {
    		filemanager_props.path = /*path*/ ctx[3];
    	}

    	if (/*mule*/ ctx[1] !== void 0) {
    		filemanager_props.mule = /*mule*/ ctx[1];
    	}

    	if (/*sorter*/ ctx[2] !== void 0) {
    		filemanager_props.sorter = /*sorter*/ ctx[2];
    	}

    	if (/*mode*/ ctx[6] !== void 0) {
    		filemanager_props.mode = /*mode*/ ctx[6];
    	}

    	filemanager = new FileManager({ props: filemanager_props, $$inline: true });
    	binding_callbacks.push(() => bind(filemanager, 'path', filemanager_path_binding));
    	binding_callbacks.push(() => bind(filemanager, 'mule', filemanager_mule_binding));
    	binding_callbacks.push(() => bind(filemanager, 'sorter', filemanager_sorter_binding));
    	binding_callbacks.push(() => bind(filemanager, 'mode', filemanager_mode_binding));
    	filemanager.$on("pathEvent", /*chPath*/ ctx[8]);
    	filemanager.$on("openItem", /*openSlideshow*/ ctx[7]);
    	filemanager.$on("reload", /*reload*/ ctx[10]);
    	filemanager.$on("logout", /*logout_handler*/ ctx[16]);
    	let if_block = !!/*footer*/ ctx[5] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(filemanager.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(p, "class", "navbar-brand cursor-pointer");
    			add_location(p, file$1, 135, 12, 4386);
    			attr_dev(nav, "class", "navbar blue dark-2");
    			add_location(nav, file$1, 134, 8, 4341);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, p);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(filemanager, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(p, "click", /*goToRoot*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*config*/ 1) && t0_value !== (t0_value = /*config*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			const filemanager_changes = {};
    			if (dirty & /*config*/ 1) filemanager_changes.config = /*config*/ ctx[0];

    			if (!updating_path && dirty & /*path*/ 8) {
    				updating_path = true;
    				filemanager_changes.path = /*path*/ ctx[3];
    				add_flush_callback(() => updating_path = false);
    			}

    			if (!updating_mule && dirty & /*mule*/ 2) {
    				updating_mule = true;
    				filemanager_changes.mule = /*mule*/ ctx[1];
    				add_flush_callback(() => updating_mule = false);
    			}

    			if (!updating_sorter && dirty & /*sorter*/ 4) {
    				updating_sorter = true;
    				filemanager_changes.sorter = /*sorter*/ ctx[2];
    				add_flush_callback(() => updating_sorter = false);
    			}

    			if (!updating_mode && dirty & /*mode*/ 64) {
    				updating_mode = true;
    				filemanager_changes.mode = /*mode*/ ctx[6];
    				add_flush_callback(() => updating_mode = false);
    			}

    			filemanager.$set(filemanager_changes);

    			if (!!/*footer*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*footer*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filemanager.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filemanager.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (detaching) detach_dev(t1);
    			destroy_component(filemanager, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(134:4) {#if slideshowIndex < 0}",
    		ctx
    	});

    	return block;
    }

    // (141:8) {#if !!footer}
    function create_if_block_1(ctx) {
    	let footer_1;
    	let raw_value = /*footer*/ ctx[5].html + "";
    	let footer_1_class_value;
    	let footer_1_outro;
    	let current;

    	const block = {
    		c: function create() {
    			footer_1 = element("footer");
    			attr_dev(footer_1, "class", footer_1_class_value = "footer font-s1 lh-1 " + /*footer*/ ctx[5].color);
    			add_location(footer_1, file$1, 141, 12, 4709);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer_1, anchor);
    			footer_1.innerHTML = raw_value;
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*footer*/ 32) && raw_value !== (raw_value = /*footer*/ ctx[5].html + "")) footer_1.innerHTML = raw_value;
    			if (!current || dirty & /*footer*/ 32 && footer_1_class_value !== (footer_1_class_value = "footer font-s1 lh-1 " + /*footer*/ ctx[5].color)) {
    				attr_dev(footer_1, "class", footer_1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (footer_1_outro) footer_1_outro.end(1);
    			current = true;
    		},
    		o: function outro(local) {
    			footer_1_outro = create_out_transition(footer_1, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer_1);
    			if (detaching && footer_1_outro) footer_1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(141:8) {#if !!footer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let title_value;
    	let t;
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	document.title = title_value = composeTitle(/*config*/ ctx[0].title, /*path*/ ctx[3]);
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*slideshowIndex*/ ctx[4] < 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			t = space();
    			main = element("main");
    			if_block.c();
    			add_location(main, file$1, 132, 0, 4297);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*composeTitle, config, path*/ 9) && title_value !== (title_value = composeTitle(/*config*/ ctx[0].title, /*path*/ ctx[3]))) {
    				document.title = title_value;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function hash2path() {
    	return decodeURIComponent(window.location.hash.substring(1)).replace(/^\/+/, '').replace(/\/+$/, '').split("/").filter(el => el != "" && el != null); // removes trailing and leading '/'
    	// splits over '/'
    }

    function composeTitle(_title, _path) {
    	return _title.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '').trim() + " - /" + _path.join("/").replaceAll("//", "/");
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let mule;
    	let path;
    	let slideshowIndex;
    	let sorter;
    	let mode;
    	let footer;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { config } = $$props;
    	let hashPathWasSetByMe = true;
    	let footers = [];
    	let footerHandler = -1;

    	function addFooter(obj) {
    		function nxtFooter() {
    			$$invalidate(5, footer = footers.shift());

    			if (!footer) {
    				footerHandler = -1;
    			} else {
    				footerHandler = setTimeout(nxtFooter, 2000);
    			}
    		}

    		if (footerHandler < 0) {
    			$$invalidate(5, footer = obj);
    			footerHandler = setTimeout(nxtFooter, 2000);
    		} else {
    			footers.push(obj);
    		}
    	}

    	function setPathAsHash() {
    		const nuHash = '#' + encodeURIComponent('/' + path.join('/').replace(/\/+$/, '').replaceAll(/\/+/g, '\/'));

    		if (nuHash != window.location.hash) {
    			hashPathWasSetByMe = true;
    			window.location.hash = nuHash;
    		}
    	}

    	onMount(() => {
    		addFooter({
    			color: "blue dark-2",
    			html: `<span>
          🐶 <a class="pup-a" target="_blank" href="https://github.com/proofrock/pupcloud/">Pupcloud</a>
                ${config.version} -
            <a class="pup-a" href="https://germ.gitbook.io/pupcloud/">Documentation</a> -
            <a class="pup-a" href="https://github.com/proofrock/pupcloud">Github Page</a> -
            <a class="pup-a" href="https://pupcloud.vercel.app/">Demo site</a>
        </span>`
    		});

    		if (config.readOnly) {
    			addFooter({
    				color: "yellow",
    				html: "<span>🐶 Pupcloud is in <b>read only</b> mode.</span>"
    			});
    		}

    		loadPath(hash2path());
    	});

    	async function loadPath(nuPath) {
    		const res = await fetch("mocks/ls" + nuPath.length + ".json");

    		if (res.status != 200) {
    			addFooter({
    				color: "red",
    				html: "<span><b>ERROR</b> In changing dir: " + await res.text() + "</span>"
    			});
    		} else {
    			$$invalidate(1, mule = Mule.fromAny(await res.json(), nuPath).sort(sorter));
    			$$invalidate(3, path = nuPath);
    			setPathAsHash();
    		}
    	}

    	window.addEventListener(
    		'hashchange',
    		() => {
    			if (hashPathWasSetByMe) hashPathWasSetByMe = false; else loadPath(hash2path());
    		},
    		false
    	);

    	function openSlideshow(event) {
    		$$invalidate(4, slideshowIndex = mule.files.findIndex(i => i.uuid == event.detail.uuid));
    	}

    	function chPath(event) {
    		loadPath(event.detail.path);
    	}

    	function closeSlideshow() {
    		$$invalidate(4, slideshowIndex = -1);
    	}

    	function reload() {
    		loadPath(path);
    	}

    	function goToRoot() {
    		loadPath([]);
    	}

    	const writable_props = ['config'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function filemanager_path_binding(value) {
    		path = value;
    		$$invalidate(3, path);
    	}

    	function filemanager_mule_binding(value) {
    		mule = value;
    		($$invalidate(1, mule), $$invalidate(2, sorter));
    	}

    	function filemanager_sorter_binding(value) {
    		sorter = value;
    		$$invalidate(2, sorter);
    	}

    	function filemanager_mode_binding(value) {
    		mode = value;
    		$$invalidate(6, mode);
    	}

    	function logout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fade,
    		Mule,
    		SORTERS,
    		Preview,
    		FileManager,
    		config,
    		hashPathWasSetByMe,
    		footers,
    		footerHandler,
    		addFooter,
    		hash2path,
    		setPathAsHash,
    		loadPath,
    		openSlideshow,
    		chPath,
    		closeSlideshow,
    		reload,
    		goToRoot,
    		composeTitle,
    		path,
    		slideshowIndex,
    		mule,
    		sorter,
    		footer,
    		mode
    	});

    	$$self.$inject_state = $$props => {
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    		if ('hashPathWasSetByMe' in $$props) hashPathWasSetByMe = $$props.hashPathWasSetByMe;
    		if ('footers' in $$props) footers = $$props.footers;
    		if ('footerHandler' in $$props) footerHandler = $$props.footerHandler;
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    		if ('slideshowIndex' in $$props) $$invalidate(4, slideshowIndex = $$props.slideshowIndex);
    		if ('mule' in $$props) $$invalidate(1, mule = $$props.mule);
    		if ('sorter' in $$props) $$invalidate(2, sorter = $$props.sorter);
    		if ('footer' in $$props) $$invalidate(5, footer = $$props.footer);
    		if ('mode' in $$props) $$invalidate(6, mode = $$props.mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*mule, sorter*/ 6) {
    			{
    				$$invalidate(1, mule = mule.sort(sorter));
    			}
    		}
    	};

    	$$invalidate(1, mule = Mule.empty());
    	$$invalidate(3, path = []);
    	$$invalidate(4, slideshowIndex = -1);
    	$$invalidate(2, sorter = SORTERS.ABC);
    	$$invalidate(6, mode = "GRID");
    	$$invalidate(5, footer = null);

    	return [
    		config,
    		mule,
    		sorter,
    		path,
    		slideshowIndex,
    		footer,
    		mode,
    		openSlideshow,
    		chPath,
    		closeSlideshow,
    		reload,
    		goToRoot,
    		filemanager_path_binding,
    		filemanager_mule_binding,
    		filemanager_sorter_binding,
    		filemanager_mode_binding,
    		logout_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { config: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*config*/ ctx[0] === undefined && !('config' in props)) {
    			console.warn("<App> was created without expected prop 'config'");
    		}
    	}

    	get config() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Auth.svelte generated by Svelte v3.49.0 */
    const file = "src\\Auth.svelte";

    // (102:0) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "blanket");
    			add_location(div, file, 102, 4, 3218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(102:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (100:0) {#if config != null}
    function create_if_block(ctx) {
    	let app;
    	let current;

    	app = new App({
    			props: { config: /*config*/ ctx[0] },
    			$$inline: true
    		});

    	app.$on("logout", /*logout*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(app.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(app, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const app_changes = {};
    			if (dirty & /*config*/ 1) app_changes.config = /*config*/ ctx[0];
    			app.$set(app_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(app.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(app.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(app, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(100:0) {#if config != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*config*/ ctx[0] != null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let config;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Auth', slots, []);
    	let cycleHandler = -1;
    	let firstAuth = true;

    	onMount(async () => {
    		await auth();
    	});

    	async function auth() {
    		const params = new URLSearchParams(window.location.search);
    		let url = "mocks/features.json";

    		if (params.has("x")) {
    			url += "?p=" + encodeURIComponent(params.get("p")) + "&r=" + encodeURIComponent(params.get("r")) + "&x=" + encodeURIComponent(params.get("x"));
    		}

    		let password = "";

    		while (true) {
    			let res = null;

    			try {
    				res = await fetch(url, { headers: { "x-pupcloud-pwd": password } });
    			} catch(e) {
    				res = {
    					status: 500,
    					text: () => "Server is down"
    				};
    			}

    			if (res.status == 200) {
    				const cfgObj = await res.json();
    				$$invalidate(0, config = Config.fromAny(cfgObj));
    				firstAuth = false;
    				cycleHandler = setTimeout(auth, 2000);
    				break;
    			}

    			$$invalidate(0, config = null);

    			if (res.status == 499) {
    				if (firstAuth) firstAuth = false; else {
    					await sweetalert2_all.fire({
    						icon: "error",
    						text: await res.text(),
    						confirmButtonColor: "#0a6bb8"
    					});
    				}

    				const { value: pwd } = await sweetalert2_all.fire({
    					titleText: "Enter password",
    					confirmButtonColor: "#0a6bb8",
    					input: "password",
    					inputAttributes: {
    						autocapitalize: "off",
    						autocorrect: "off"
    					}
    				});

    				password = pwd;
    			} else {
    				await sweetalert2_all.fire({
    					icon: "error",
    					text: await res.text(),
    					confirmButtonColor: "#0a6bb8"
    				});
    			}
    		}
    	}

    	async function logout() {
    		await fetch("logout");
    		$$invalidate(0, config = null);
    		firstAuth = true;
    		if (cycleHandler >= 0) clearTimeout(cycleHandler);
    		window.location.reload();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Auth> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		App,
    		Config,
    		onMount,
    		Swal: sweetalert2_all,
    		cycleHandler,
    		firstAuth,
    		auth,
    		logout,
    		config
    	});

    	$$self.$inject_state = $$props => {
    		if ('cycleHandler' in $$props) cycleHandler = $$props.cycleHandler;
    		if ('firstAuth' in $$props) firstAuth = $$props.firstAuth;
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, config = null);
    	return [config, logout];
    }

    class Auth extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Auth",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /*
     * This file is part of PupCloud, Copyright (c) 2022-2078, Germano Rizzo
     *
     * PupCloud is free software: you can redistribute it and/or modify
     * it under the terms of the GNU General Public License as published by
     * the Free Software Foundation, either version 3 of the License, or
     * (at your option) any later version.
     *
     * PupCloud is distributed in the hope that it will be useful,
     * but WITHOUT ANY WARRANTY; without even the implied warranty of
     * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     * GNU General Public License for more details.
     *
     * You should have received a copy of the GNU General Public License
     * along with PupCloud.  If not, see <http://www.gnu.org/licenses/>.
     */
    const app = new Auth({
        target: document.getElementById("app"),
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
