
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$2() { }
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
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$2;

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
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
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
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
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
    }
    const null_transition = { duration: 0 };
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
            const { delay = 0, duration = 300, easing = identity, tick = noop$2, css } = config || null_transition;
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
            update: noop$2,
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
            this.$destroy = noop$2;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
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

    /* src/MimeTypes.svelte generated by Svelte v3.46.4 */

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

    function getIcon(mt) {
    	return mt == "directory"
    	? "file-manager"
    	: isMimeTypeImage(mt)
    		? "image-x-generic"
    		: isMimeTypeVideo(mt)
    			? "video-x-generic"
    			: isMimeTypeAudio(mt)
    				? "audio-x-generic"
    				: isMimeTypeText(mt)
    					? "text-x-generic"
    					: isMimeTypePDF(mt)
    						? "application-pdf"
    						: "application-octet-stream";
    }

    /* src/Struct.svelte generated by Svelte v3.46.4 */

    function sortDirs(f1, f2) {
    	const f1Dir = f1.mimeType === "directory";
    	const f2Dir = f2.mimeType === "directory";
    	return f1Dir == f2Dir ? 0 : f2Dir ? 1 : -1;
    }

    class ConfigSharing {
    	constructor(allowRW, tokens) {
    		this.allowRW = allowRW;
    		this.tokens = tokens;
    	}
    }

    class Config {
    	constructor(version, title, readOnly, sharing) {
    		this.version = version;
    		this.title = title;
    		this.readOnly = readOnly;
    		this.sharing = sharing;
    	}

    	static empty() {
    		return new Config("", "", false, null);
    	}

    	static fromAny(obj) {
    		const sharing = obj.sharing == null
    		? null
    		: new ConfigSharing(obj.sharing.allowRW, obj.sharing.tokens);

    		return new Config(obj.version, obj.title, obj.readOnly, sharing);
    	}
    }

    class File {
    	constructor(mimeType, name, size, chDate, owner, group, permissions, path) {
    		this.uuid = Math.random().toString().substring(2);
    		this.mimeType = mimeType;
    		this.isDir = mimeType == "directory";
    		this.isRoot = this.isDir && this.name == "..";
    		this.icon = getIcon(mimeType);
    		this.name = name + (this.isDir ? "/" : "");
    		this.size = formatBytes(size);
    		this.numSize = size;
    		this.chDate = new Date(chDate * 1000).toLocaleString();
    		this.numChDate = chDate;
    		this.owner = owner;
    		this.group = group;
    		this.permissions = permissions;
    		this.path = path.join("/") + this.name;

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
    			const nf = new File(items[i].mimeType, items[i].name, items[i].size, items[i].chDate, items[i].owner, items[i].group, items[i].permissions, path);
    			this.items.push(nf);

    			if (!nf.isDir) {
    				this.files.push(nf);
    			}
    		}

    		if (path.length > 0) {
    			// Is not root
    			this.items.unshift(new File("directory", "..", -1, 0, "--", "--", "--", path));
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

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/Snippets/TextShower.svelte generated by Svelte v3.46.4 */
    const file_1 = "src/Snippets/TextShower.svelte";

    function create_fragment$s(ctx) {
    	let div;
    	let pre;
    	let t;
    	let div_title_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			pre = element("pre");
    			t = text(/*contents*/ ctx[1]);
    			add_location(pre, file_1, 26, 4, 936);
    			attr_dev(div, "title", div_title_value = /*file*/ ctx[0].name);
    			add_location(div, file_1, 25, 0, 907);
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
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { url: 2, file: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextShower",
    			options,
    			id: create_fragment$s.name
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

    /* src/SVG/IconDownload.svelte generated by Svelte v3.46.4 */

    const file$r = "src/SVG/IconDownload.svelte";

    function create_fragment$r(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z");
    			add_location(path, file$r, 12, 4, 348);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$r, 5, 0, 136);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconDownload",
    			options,
    			id: create_fragment$r.name
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

    /* src/Preview/Slideshow.svelte generated by Svelte v3.46.4 */
    const file$q = "src/Preview/Slideshow.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (162:0) {:else}
    function create_else_block$5(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t1;
    	let div1;
    	let a;
    	let icondownload;
    	let a_href_value;
    	let t2;
    	let div2;
    	let t4;
    	let div3;
    	let div4_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*files*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*file*/ ctx[9].uuid;
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	icondownload = new IconDownload({
    			props: { size: 24, color: "white" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div1 = element("div");
    			a = element("a");
    			create_component(icondownload.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			div2.textContent = "❮";
    			t4 = space();
    			div3 = element("div");
    			div3.textContent = "❯";
    			attr_dev(div0, "class", "x-top-right cursor-pointer svelte-q9cmq7");
    			add_location(div0, file$q, 163, 8, 4048);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", a_href_value = getWS(/*files*/ ctx[1][/*fileIdx*/ ctx[0]], true));
    			attr_dev(a, "class", "svelte-q9cmq7");
    			add_location(a, file$q, 211, 12, 6659);
    			attr_dev(div1, "class", "download svelte-q9cmq7");
    			attr_dev(div1, "title", "Download");
    			add_location(div1, file$q, 210, 8, 6606);
    			attr_dev(div2, "class", "prev svelte-q9cmq7");
    			add_location(div2, file$q, 215, 8, 6814);
    			attr_dev(div3, "class", "next svelte-q9cmq7");
    			add_location(div3, file$q, 216, 8, 6872);
    			attr_dev(div4, "class", "blanket svelte-q9cmq7");
    			add_location(div4, file$q, 162, 4, 4001);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div1, a);
    			mount_component(icondownload, a, null);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*close*/ ctx[3], false, false, false),
    					listen_dev(div2, "click", /*prev*/ ctx[7], false, false, false),
    					listen_dev(div3, "click", /*next*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files, getWS, isMimeTypeText, openFullscreen, isMimeTypeImage, isMimeTypeVideo, isMimeTypeAudio, isMimeTypePDF, isMimeTypeSupported, fileIdx*/ 19) {
    				each_value = /*files*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div4, outro_and_destroy_block, create_each_block$4, t1, get_each_context$4);
    				check_outros();
    			}

    			if (!current || dirty & /*files, fileIdx*/ 3 && a_href_value !== (a_href_value = getWS(/*files*/ ctx[1][/*fileIdx*/ ctx[0]], true))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(icondownload.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div4_transition) div4_transition = create_bidirectional_transition(div4, fade, {}, true);
    				div4_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(icondownload.$$.fragment, local);
    			if (!div4_transition) div4_transition = create_bidirectional_transition(div4, fade, {}, false);
    			div4_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			destroy_component(icondownload);
    			if (detaching && div4_transition) div4_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(162:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (153:0) {#if fullscreen}
    function create_if_block$6(ctx) {
    	let div;
    	let div_transition;
    	let t;
    	let img;
    	let img_alt_value;
    	let img_title_value;
    	let img_src_value;
    	let img_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			img = element("img");
    			attr_dev(div, "class", "blanket cursor-pointer svelte-q9cmq7");
    			add_location(div, file$q, 153, 4, 3686);
    			attr_dev(img, "alt", img_alt_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name);
    			attr_dev(img, "title", img_title_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name);
    			attr_dev(img, "class", "centered cursor-pointer svelte-q9cmq7");
    			if (!src_url_equal(img.src, img_src_value = getWS(/*files*/ ctx[1][/*fileIdx*/ ctx[0]]))) attr_dev(img, "src", img_src_value);
    			add_location(img, file$q, 154, 4, 3745);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, img, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*closeFullscreen*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*files, fileIdx*/ 3 && img_alt_value !== (img_alt_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (!current || dirty & /*files, fileIdx*/ 3 && img_title_value !== (img_title_value = /*files*/ ctx[1][/*fileIdx*/ ctx[0]].name)) {
    				attr_dev(img, "title", img_title_value);
    			}

    			if (!current || dirty & /*files, fileIdx*/ 3 && !src_url_equal(img.src, img_src_value = getWS(/*files*/ ctx[1][/*fileIdx*/ ctx[0]]))) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!img_transition) img_transition = create_bidirectional_transition(img, fade, {}, true);
    				img_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			if (!img_transition) img_transition = create_bidirectional_transition(img, fade, {}, false);
    			img_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(img);
    			if (detaching && img_transition) img_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(153:0) {#if fullscreen}",
    		ctx
    	});

    	return block;
    }

    // (166:12) {#if fileIdx == idx}
    function create_if_block_1$4(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*idx*/ ctx[11] + 1 + "";
    	let t0;
    	let t1;
    	let t2_value = /*files*/ ctx[1].length + "";
    	let t2;
    	let t3;
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let t4;
    	let div1;
    	let t5_value = /*file*/ ctx[9].name + "";
    	let t5;
    	let div2_transition;
    	let current;
    	const if_block_creators = [create_if_block_2$1, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (dirty & /*files*/ 2) show_if = null;
    		if (show_if == null) show_if = !!isMimeTypeSupported(/*file*/ ctx[9].mimeType);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text(" / ");
    			t2 = text(t2_value);
    			t3 = space();
    			if_block.c();
    			t4 = space();
    			div1 = element("div");
    			t5 = text(t5_value);
    			attr_dev(div0, "class", "numbertext svelte-q9cmq7");
    			add_location(div0, file$q, 167, 20, 4277);
    			attr_dev(div1, "class", "caption svelte-q9cmq7");
    			add_location(div1, file$q, 206, 20, 6498);
    			attr_dev(div2, "class", "slideshow-container svelte-q9cmq7");
    			add_location(div2, file$q, 166, 16, 4206);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div2, t3);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, t5);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*files*/ 2) && t0_value !== (t0_value = /*idx*/ ctx[11] + 1 + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*files*/ 2) && t2_value !== (t2_value = /*files*/ ctx[1].length + "")) set_data_dev(t2, t2_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx, dirty);

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
    				if_block.m(div2, t4);
    			}

    			if ((!current || dirty & /*files*/ 2) && t5_value !== (t5_value = /*file*/ ctx[9].name + "")) set_data_dev(t5, t5_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, {}, true);
    				div2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, {}, false);
    			div2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    			if (detaching && div2_transition) div2_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(166:12) {#if fileIdx == idx}",
    		ctx
    	});

    	return block;
    }

    // (201:20) {:else}
    function create_else_block_1$1(ctx) {
    	let img;
    	let img_alt_value;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "centered svelte-q9cmq7");
    			attr_dev(img, "alt", img_alt_value = /*file*/ ctx[9].icon);
    			if (!src_url_equal(img.src, img_src_value = "icons/48x48/" + /*file*/ ctx[9].icon + ".svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$q, 201, 24, 6277);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files*/ 2 && img_alt_value !== (img_alt_value = /*file*/ ctx[9].icon)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*files*/ 2 && !src_url_equal(img.src, img_src_value = "icons/48x48/" + /*file*/ ctx[9].icon + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(201:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (169:20) {#if isMimeTypeSupported(file.mimeType)}
    function create_if_block_2$1(ctx) {
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
    		create_if_block_3$1,
    		create_if_block_4$1,
    		create_if_block_5$1,
    		create_if_block_6$1,
    		create_if_block_7$1
    	];

    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (dirty & /*files*/ 2) show_if = null;
    		if (dirty & /*files*/ 2) show_if_1 = null;
    		if (dirty & /*files*/ 2) show_if_2 = null;
    		if (dirty & /*files*/ 2) show_if_3 = null;
    		if (dirty & /*files*/ 2) show_if_4 = null;
    		if (show_if == null) show_if = !!isMimeTypeText(/*file*/ ctx[9].mimeType);
    		if (show_if) return 0;
    		if (show_if_1 == null) show_if_1 = !!isMimeTypeImage(/*file*/ ctx[9].mimeType);
    		if (show_if_1) return 1;
    		if (show_if_2 == null) show_if_2 = !!isMimeTypeVideo(/*file*/ ctx[9].mimeType);
    		if (show_if_2) return 2;
    		if (show_if_3 == null) show_if_3 = !!isMimeTypeAudio(/*file*/ ctx[9].mimeType);
    		if (show_if_3) return 3;
    		if (show_if_4 == null) show_if_4 = !!isMimeTypePDF(/*file*/ ctx[9].mimeType);
    		if (show_if_4) return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_2(ctx, -1))) {
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
    			current_block_type_index = select_block_type_2(ctx, dirty);

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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(169:20) {#if isMimeTypeSupported(file.mimeType)}",
    		ctx
    	});

    	return block;
    }

    // (195:63) 
    function create_if_block_7$1(ctx) {
    	let embed;
    	let embed_type_value;
    	let embed_src_value;

    	const block = {
    		c: function create() {
    			embed = element("embed");
    			attr_dev(embed, "class", "centered centered-maxscreen w100 h100 svelte-q9cmq7");
    			attr_dev(embed, "type", embed_type_value = /*file*/ ctx[9].mimeType);
    			if (!src_url_equal(embed.src, embed_src_value = getWS(/*file*/ ctx[9]))) attr_dev(embed, "src", embed_src_value);
    			add_location(embed, file$q, 195, 28, 5987);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, embed, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files*/ 2 && embed_type_value !== (embed_type_value = /*file*/ ctx[9].mimeType)) {
    				attr_dev(embed, "type", embed_type_value);
    			}

    			if (dirty & /*files*/ 2 && !src_url_equal(embed.src, embed_src_value = getWS(/*file*/ ctx[9]))) {
    				attr_dev(embed, "src", embed_src_value);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(embed);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(195:63) ",
    		ctx
    	});

    	return block;
    }

    // (188:65) 
    function create_if_block_6$1(ctx) {
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
    			t = text("\r\n                                    Your browser does not support the audio tag.");
    			if (!src_url_equal(source.src, source_src_value = getWS(/*file*/ ctx[9]))) attr_dev(source, "src", source_src_value);
    			attr_dev(source, "type", source_type_value = /*file*/ ctx[9].mimeType);
    			attr_dev(source, "class", "svelte-q9cmq7");
    			add_location(source, file$q, 190, 36, 5684);
    			audio.controls = true;
    			attr_dev(audio, "class", "svelte-q9cmq7");
    			add_location(audio, file$q, 189, 32, 5630);
    			attr_dev(div, "class", "centered svelte-q9cmq7");
    			add_location(div, file$q, 188, 28, 5574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, audio);
    			append_dev(audio, source);
    			append_dev(audio, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files*/ 2 && !src_url_equal(source.src, source_src_value = getWS(/*file*/ ctx[9]))) {
    				attr_dev(source, "src", source_src_value);
    			}

    			if (dirty & /*files*/ 2 && source_type_value !== (source_type_value = /*file*/ ctx[9].mimeType)) {
    				attr_dev(source, "type", source_type_value);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(188:65) ",
    		ctx
    	});

    	return block;
    }

    // (181:65) 
    function create_if_block_5$1(ctx) {
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
    			t = text("\r\n                                    Your browser does not support the video tag.");
    			if (!src_url_equal(source.src, source_src_value = getWS(/*file*/ ctx[9]))) attr_dev(source, "src", source_src_value);
    			attr_dev(source, "type", source_type_value = /*file*/ ctx[9].mimeType);
    			attr_dev(source, "class", "svelte-q9cmq7");
    			add_location(source, file$q, 183, 36, 5269);
    			video.controls = true;
    			attr_dev(video, "class", "svelte-q9cmq7");
    			add_location(video, file$q, 182, 32, 5215);
    			attr_dev(div, "class", "centered svelte-q9cmq7");
    			add_location(div, file$q, 181, 28, 5159);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, video);
    			append_dev(video, source);
    			append_dev(video, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files*/ 2 && !src_url_equal(source.src, source_src_value = getWS(/*file*/ ctx[9]))) {
    				attr_dev(source, "src", source_src_value);
    			}

    			if (dirty & /*files*/ 2 && source_type_value !== (source_type_value = /*file*/ ctx[9].mimeType)) {
    				attr_dev(source, "type", source_type_value);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(181:65) ",
    		ctx
    	});

    	return block;
    }

    // (174:65) 
    function create_if_block_4$1(ctx) {
    	let img;
    	let img_alt_value;
    	let img_title_value;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "alt", img_alt_value = /*file*/ ctx[9].name);
    			attr_dev(img, "title", img_title_value = /*file*/ ctx[9].name);
    			attr_dev(img, "class", "centered centered-maxscreen cursor-pointer svelte-q9cmq7");
    			if (!src_url_equal(img.src, img_src_value = getWS(/*file*/ ctx[9]))) attr_dev(img, "src", img_src_value);
    			add_location(img, file$q, 174, 28, 4742);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*openFullscreen*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files*/ 2 && img_alt_value !== (img_alt_value = /*file*/ ctx[9].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*files*/ 2 && img_title_value !== (img_title_value = /*file*/ ctx[9].name)) {
    				attr_dev(img, "title", img_title_value);
    			}

    			if (dirty & /*files*/ 2 && !src_url_equal(img.src, img_src_value = getWS(/*file*/ ctx[9]))) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(174:65) ",
    		ctx
    	});

    	return block;
    }

    // (170:24) {#if isMimeTypeText(file.mimeType)}
    function create_if_block_3$1(ctx) {
    	let div;
    	let textshower;
    	let current;

    	textshower = new TextShower({
    			props: {
    				url: getWS(/*file*/ ctx[9]),
    				file: /*file*/ ctx[9]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(textshower.$$.fragment);
    			attr_dev(div, "class", "centered centered-maxscreen text-pane svelte-q9cmq7");
    			add_location(div, file$q, 170, 28, 4486);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(textshower, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textshower_changes = {};
    			if (dirty & /*files*/ 2) textshower_changes.url = getWS(/*file*/ ctx[9]);
    			if (dirty & /*files*/ 2) textshower_changes.file = /*file*/ ctx[9];
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
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(170:24) {#if isMimeTypeText(file.mimeType)}",
    		ctx
    	});

    	return block;
    }

    // (165:8) {#each files as file, idx (file.uuid)}
    function create_each_block$4(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let current;
    	let if_block = /*fileIdx*/ ctx[0] == /*idx*/ ctx[11] && create_if_block_1$4(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*fileIdx*/ ctx[0] == /*idx*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*fileIdx, files*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$4(ctx);
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
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(165:8) {#each files as file, idx (file.uuid)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*fullscreen*/ ctx[2]) return 0;
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getWS(f, forDl = false) {
    	return "/testFs/" + f.path;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let fullscreen;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slideshow', slots, []);
    	let { files = [] } = $$props;
    	let { fileIdx = 0 } = $$props;
    	const dispatch = createEventDispatcher();

    	function close(e) {
    		dispatch("message", {});
    	}

    	function openFullscreen() {
    		$$invalidate(2, fullscreen = true);
    	}

    	async function closeFullscreen() {
    		$$invalidate(2, fullscreen = false);
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
    		createEventDispatcher,
    		fade,
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
    		close,
    		getWS,
    		openFullscreen,
    		closeFullscreen,
    		next,
    		prev,
    		fullscreen
    	});

    	$$self.$inject_state = $$props => {
    		if ('files' in $$props) $$invalidate(1, files = $$props.files);
    		if ('fileIdx' in $$props) $$invalidate(0, fileIdx = $$props.fileIdx);
    		if ('fullscreen' in $$props) $$invalidate(2, fullscreen = $$props.fullscreen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(2, fullscreen = false);
    	return [fileIdx, files, fullscreen, close, openFullscreen, closeFullscreen, next, prev];
    }

    class Slideshow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { files: 1, fileIdx: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slideshow",
    			options,
    			id: create_fragment$q.name
    		});
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
    var _draggedPositionX, _isAnimated, _children, _totalMediaToLoad, _loadedMediaCount, _isResizing, _isScrolling, _isPressed, _deltaX, _deltaY, _windowResizeRef, _arrowPrev, _arrowNext, _arrowNextRef, _arrowPrevRef, _touchStartRef, _touchMoveRef, _touchReleaseRef, _xStart, _yStart, _indicators, _autoplayInterval, _pointerType, _getChildren, getChildren_fn, _waitForLoad, waitForLoad_fn, _newItemLoaded, newItemLoaded_fn, _setItemsPosition, setItemsPosition_fn, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn, _handleDragStart, handleDragStart_fn, _handleDragMove, handleDragMove_fn, _handleDragRelease, handleDragRelease_fn, _enableIndicators, enableIndicators_fn, _handleIndicatorClick, handleIndicatorClick_fn, _resetIndicators, resetIndicators_fn, _getXPosition, getXPosition_fn, _getYPosition, getYPosition_fn, _setTransitionDuration, setTransitionDuration_fn, _emitSlideEvent, emitSlideEvent_fn, _triggers, _sidenavTriggers, _isInit, _isActive, _isAnimated2, _childIsActive, _listenerRef, _resizeRef, _sidenavId, _handleResize, handleResize_fn, _detectSidenav, detectSidenav_fn, _addActiveInSidenav, addActiveInSidenav_fn, _toggleTriggerActive, toggleTriggerActive_fn, _autoClose, autoClose_fn, _applyOverflow, applyOverflow_fn, _onClickTrigger, onClickTrigger_fn, _triggers2, _isActive2, _isAnimated3, _isFixed, _firstSidenavInit, _layoutEl, _overlayElement, _listenerRef2, _windowResizeRef2, _windowWidth, _resizeHandler, resizeHandler_fn, _cleanLayout, cleanLayout_fn, _handleMultipleSidenav, handleMultipleSidenav_fn, _toggleBodyScroll, toggleBodyScroll_fn, _onClickTrigger2, onClickTrigger_fn2, _dropdownContent, _trigger, _isAnimated4, _isActive3, _documentClickRef, _listenerRef3, _contentHeightRef, _setupAnimation, setupAnimation_fn, _onDocumentClick, onDocumentClick_fn, _onClickTrigger3, onClickTrigger_fn3, _autoClose2, autoClose_fn2, _setContentHeight, setContentHeight_fn, _isAnimated5, _isActive4, _trigger2, _fabMenu, _openRef, _closeRef, _documentClickRef2, _listenerRef4, _verifOptions, verifOptions_fn, _setProperties, setProperties_fn, _setMenuPosition, setMenuPosition_fn, _handleDocumentClick, handleDocumentClick_fn, _onClickTrigger4, onClickTrigger_fn4, _onClickRef, _transitionEndEventRef, _keyUpRef, _scrollRef, _resizeRef2, _overlay, _overlayClickEventRef, _overflowParents, _baseRect, _newHeight, _newWidth, _isActive5, _isResponsive, _container, _isClosing, _isOpening, _setOverlay, setOverlay_fn, _showOverlay, showOverlay_fn, _hideOverlay, hideOverlay_fn, _unsetOverlay, unsetOverlay_fn, _calculateRatio, calculateRatio_fn, _setOverflowParents, setOverflowParents_fn, _unsetOverflowParents, unsetOverflowParents_fn, _handleTransition, handleTransition_fn, _handleKeyUp, handleKeyUp_fn, _handleScroll, handleScroll_fn, _handleResize2, _clearLightbox, clearLightbox_fn, _onClickTrigger5, onClickTrigger_fn5, _triggers3, _isActive6, _isAnimated6, _listenerRef5, _toggleBodyScroll2, toggleBodyScroll_fn2, _setZIndex, setZIndex_fn, _onClickTrigger6, onClickTrigger_fn6, _tabArrow, _tabLinks, _tabMenu, _currentItemIndex, _leftArrow, _rightArrow, _scrollLeftRef, _scrollRightRef, _arrowRef, _caroulixSlideRef, _resizeTabRef, _tabItems, _tabCaroulix, _tabCaroulixInit, _caroulixInstance, _isAnimated7, _handleResizeEvent, handleResizeEvent_fn, _handleCaroulixSlide, handleCaroulixSlide_fn, _getItems, getItems_fn, _hideContent, hideContent_fn, _enableSlideAnimation, enableSlideAnimation_fn, _setActiveElement, setActiveElement_fn, _toggleArrowMode, toggleArrowMode_fn, _scrollLeft, scrollLeft_fn, _scrollRight, scrollRight_fn, _onClickItem, onClickItem_fn, _getPreviousItemIndex, getPreviousItemIndex_fn, _getNextItemIndex, getNextItemIndex_fn, _oldLink, _updateRef, _links, _elements, _setupBasic, setupBasic_fn, _setupAuto, setupAuto_fn, _getElement, getElement_fn, _removeOldLink, removeOldLink_fn, _getClosestElem, getClosestElem_fn, _update, update_fn, _content, _toasters, _createToaster, createToaster_fn, _removeToaster, removeToaster_fn, _fadeInToast, fadeInToast_fn, _fadeOutToast, fadeOutToast_fn, _animOut, animOut_fn, _createToast, createToast_fn, _hide, hide_fn, _tooltip, _positionList, _listenerEnterRef, _listenerLeaveRef, _listenerResizeRef, _timeoutRef, _elRect, _tooltipRect, _setProperties2, setProperties_fn2, _setBasicPosition, setBasicPosition_fn, _manualTransform, manualTransform_fn, _onHover, onHover_fn, _onHoverOut, onHoverOut_fn, _dropdownInstance, _container2, _input, _label, _clickRef, _setupDropdown, setupDropdown_fn, _createCheckbox, createCheckbox_fn, _setupContent, setupContent_fn, _setFocusedClass, setFocusedClass_fn, _onClick, onClick_fn, _select, select_fn, _unSelect, unSelect_fn;
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
    const setup = () => {
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
      setup();
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
        __privateAdd(this, _getXPosition);
        __privateAdd(this, _getYPosition);
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
      __privateSet(this, _xStart, __privateMethod(this, _getXPosition, getXPosition_fn).call(this, e));
      __privateSet(this, _yStart, __privateMethod(this, _getYPosition, getYPosition_fn).call(this, e));
    };
    _handleDragMove = new WeakSet();
    handleDragMove_fn = function(e) {
      if (!__privateGet(this, _isPressed) || __privateGet(this, _isScrolling))
        return;
      let x = __privateMethod(this, _getXPosition, getXPosition_fn).call(this, e), y = __privateMethod(this, _getYPosition, getYPosition_fn).call(this, e);
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
    _getXPosition = new WeakSet();
    getXPosition_fn = function(e) {
      if (e.targetTouches && e.targetTouches.length >= 1)
        return e.targetTouches[0].clientX;
      return e.clientX;
    };
    _getYPosition = new WeakSet();
    getYPosition_fn = function(e) {
      if (e.targetTouches && e.targetTouches.length >= 1)
        return e.targetTouches[0].clientY;
      return e.clientY;
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
        __privateAdd(this, _createToast);
        __privateAdd(this, _hide);
        __publicField(this, "options");
        __publicField(this, "id");
        __privateAdd(this, _content, void 0);
        __privateAdd(this, _toasters, void 0);
        if (getInstanceByType("Toast").length > 0) {
          console.error("[Axentix] Toast: Don't try to create multiple toast instances");
          return;
        }
        instances.push({ type: "Toast", instance: this });
        this.id = Math.random().toString().split(".")[1];
        __privateSet(this, _content, content);
        this.options = extend(_Toast.getDefaultOptions(), options);
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
      const formField = input.closest(".form-field");
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
    const getLabelColor = (label) => {
      let target = label;
      while (target.parentElement) {
        let bg = window.getComputedStyle(target).backgroundColor;
        if (bg && !["transparent", "rgba(0, 0, 0, 0)"].includes(bg)) {
          return bg;
        }
        target = target.parentElement;
      }
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

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*!
    * sweetalert2 v11.4.4
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
       * @param {NodeList | HTMLCollection | NamedNodeMap} nodeList
       * @returns {array}
       */

      const toArray = nodeList => Array.prototype.slice.call(nodeList);
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
      const prefix = items => {
        const result = {};

        for (const i in items) {
          result[items[i]] = swalPrefix + items[i];
        }

        return result;
      };
      const swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'show', 'hide', 'close', 'title', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'default-outline', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error']);
      const iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

      /**
       * Gets the popup container which contains the backdrop and the popup itself.
       *
       * @returns {HTMLElement | null}
       */

      const getContainer = () => document.body.querySelector(".".concat(swalClasses.container));
      const elementBySelector = selectorString => {
        const container = getContainer();
        return container ? container.querySelector(selectorString) : null;
      };

      const elementByClass = className => {
        return elementBySelector(".".concat(className));
      };

      const getPopup = () => elementByClass(swalClasses.popup);
      const getIcon = () => elementByClass(swalClasses.icon);
      const getTitle = () => elementByClass(swalClasses.title);
      const getHtmlContainer = () => elementByClass(swalClasses['html-container']);
      const getImage = () => elementByClass(swalClasses.image);
      const getProgressSteps = () => elementByClass(swalClasses['progress-steps']);
      const getValidationMessage = () => elementByClass(swalClasses['validation-message']);
      const getConfirmButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
      const getDenyButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));
      const getInputLabel = () => elementByClass(swalClasses['input-label']);
      const getLoader = () => elementBySelector(".".concat(swalClasses.loader));
      const getCancelButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
      const getActions = () => elementByClass(swalClasses.actions);
      const getFooter = () => elementByClass(swalClasses.footer);
      const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar']);
      const getCloseButton = () => elementByClass(swalClasses.close); // https://github.com/jkup/focusable/blob/master/index.js

      const focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
      const getFocusableElements = () => {
        const focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) // sort according to tabindex
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
        const otherFocusableElements = toArray(getPopup().querySelectorAll(focusable)).filter(el => el.getAttribute('tabindex') !== '-1');
        return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(el => isVisible(el));
      };
      const isModal = () => {
        return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses['toast-shown']) && !hasClass(document.body, swalClasses['no-backdrop']);
      };
      const isToast = () => {
        return getPopup() && hasClass(getPopup(), swalClasses.toast);
      };
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
          toArray(parsed.querySelector('head').childNodes).forEach(child => {
            elem.appendChild(child);
          });
          toArray(parsed.querySelector('body').childNodes).forEach(child => {
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

      const removeCustomClasses = (elem, params) => {
        toArray(elem.classList).forEach(className => {
          if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass).includes(className)) {
            elem.classList.remove(className);
          }
        });
      };

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
       * @param {string} inputType
       * @returns {HTMLInputElement | null}
       */

      const getInput = (popup, inputType) => {
        if (!inputType) {
          return null;
        }

        switch (inputType) {
          case 'select':
          case 'textarea':
          case 'file':
            return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses[inputType]));

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
       * @param {HTMLInputElement} input
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
       * @param {string | string[]} classList
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
       * @param {string | string[]} classList
       */

      const addClass = (target, classList) => {
        toggleClass(target, classList, true);
      };
      /**
       * @param {HTMLElement | HTMLElement[] | null} target
       * @param {string | string[]} classList
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
        const childNodes = toArray(elem.childNodes);

        for (let i = 0; i < childNodes.length; i++) {
          if (hasClass(childNodes[i], className)) {
            return childNodes[i];
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
      const setStyle = (parent, selector, property, value) => {
        const el = parent.querySelector(selector);

        if (el) {
          el.style[property] = value;
        }
      };
      const toggle = (elem, condition, display) => {
        condition ? show(elem, display) : hide(elem);
      }; // borrowed from jquery $(elem).is(':visible') implementation

      const isVisible = elem => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
      const allButtonsAreHidden = () => !isVisible(getConfirmButton()) && !isVisible(getDenyButton()) && !isVisible(getCancelButton());
      const isScrollable = elem => !!(elem.scrollHeight > elem.clientHeight); // borrowed from https://stackoverflow.com/a/46352119

      const hasCssAnimation = elem => {
        const style = window.getComputedStyle(elem);
        const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
        const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
        return animDuration > 0 || transDuration > 0;
      };
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

      const globalState = {};

      const focusPreviousActiveElement = () => {
        if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
          globalState.previousActiveElement.focus();
          globalState.previousActiveElement = null;
        } else if (document.body) {
          document.body.focus();
        }
      }; // Restore previous active (focused) element


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
        const range = popup.querySelector(".".concat(swalClasses.range, " input"));
        const rangeOutput = popup.querySelector(".".concat(swalClasses.range, " output"));
        const select = getDirectChildByClass(popup, swalClasses.select);
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
          range.nextSibling.value = range.value;
        };
      };

      const getTarget = target => typeof target === 'string' ? document.querySelector(target) : target;

      const setupAccessibility = params => {
        const popup = getPopup();
        popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
        popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');

        if (!params.toast) {
          popup.setAttribute('aria-modal', 'true');
        }
      };

      const setupRTL = targetElement => {
        if (window.getComputedStyle(targetElement).direction === 'rtl') {
          addClass(getContainer(), swalClasses.rtl);
        }
      };
      /*
       * Add modal + backdrop to DOM
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

      // https://github.com/twbs/bootstrap/blob/master/js/src/modal.js

      const measureScrollbar = () => {
        const scrollDiv = document.createElement('div');
        scrollDiv.className = swalClasses['scrollbar-measure'];
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
      };

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

      function renderButton(button, buttonType, params) {
        toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], 'inline-block');
        setInnerHtml(button, params["".concat(buttonType, "ButtonText")]); // Set caption text

        button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")]); // ARIA label
        // Add buttons custom classes

        button.className = swalClasses[buttonType];
        applyCustomClass(button, params, "".concat(buttonType, "Button"));
        addClass(button, params["".concat(buttonType, "ButtonClass")]);
      }

      function handleBackdropParam(container, backdrop) {
        if (typeof backdrop === 'string') {
          container.style.background = backdrop;
        } else if (!backdrop) {
          addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
        }
      }

      function handlePositionParam(container, position) {
        if (position in swalClasses) {
          addClass(container, swalClasses[position]);
        } else {
          warn('The "position" parameter is not valid, defaulting to "center"');
          addClass(container, swalClasses.center);
        }
      }

      function handleGrowParam(container, grow) {
        if (grow && typeof grow === 'string') {
          const growClass = "grow-".concat(grow);

          if (growClass in swalClasses) {
            addClass(container, swalClasses[growClass]);
          }
        }
      }

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

      const inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
      const renderInput = (instance, params) => {
        const popup = getPopup();
        const innerParams = privateProps.innerParams.get(instance);
        const rerender = !innerParams || params.input !== innerParams.input;
        inputTypes.forEach(inputType => {
          const inputClass = swalClasses[inputType];
          const inputContainer = getDirectChildByClass(popup, inputClass); // set attributes

          setAttributes(inputType, params.inputAttributes); // set class

          inputContainer.className = inputClass;

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

      const showInput = params => {
        if (!renderInputType[params.input]) {
          return error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
        }

        const inputContainer = getInputContainer(params.input);
        const input = renderInputType[params.input](inputContainer, params);
        show(input); // input autofocus

        setTimeout(() => {
          focusInput(input);
        });
      };

      const removeAttributes = input => {
        for (let i = 0; i < input.attributes.length; i++) {
          const attrName = input.attributes[i].name;

          if (!['type', 'value', 'style'].includes(attrName)) {
            input.removeAttribute(attrName);
          }
        }
      };

      const setAttributes = (inputType, inputAttributes) => {
        const input = getInput(getPopup(), inputType);

        if (!input) {
          return;
        }

        removeAttributes(input);

        for (const attr in inputAttributes) {
          input.setAttribute(attr, inputAttributes[attr]);
        }
      };

      const setCustomClass = params => {
        const inputContainer = getInputContainer(params.input);

        if (params.customClass) {
          addClass(inputContainer, params.customClass.input);
        }
      };

      const setInputPlaceholder = (input, params) => {
        if (!input.placeholder || params.inputPlaceholder) {
          input.placeholder = params.inputPlaceholder;
        }
      };

      const setInputLabel = (input, prependTo, params) => {
        if (params.inputLabel) {
          input.id = swalClasses.input;
          const label = document.createElement('label');
          const labelClass = swalClasses['input-label'];
          label.setAttribute('for', input.id);
          label.className = labelClass;
          addClass(label, params.customClass.inputLabel);
          label.innerText = params.inputLabel;
          prependTo.insertAdjacentElement('beforebegin', label);
        }
      };

      const getInputContainer = inputType => {
        const inputClass = swalClasses[inputType] ? swalClasses[inputType] : swalClasses.input;
        return getDirectChildByClass(getPopup(), inputClass);
      };

      const renderInputType = {};

      renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = (input, params) => {
        if (typeof params.inputValue === 'string' || typeof params.inputValue === 'number') {
          input.value = params.inputValue;
        } else if (!isPromise(params.inputValue)) {
          warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(typeof params.inputValue, "\""));
        }

        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        input.type = params.input;
        return input;
      };

      renderInputType.file = (input, params) => {
        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        return input;
      };

      renderInputType.range = (range, params) => {
        const rangeInput = range.querySelector('input');
        const rangeOutput = range.querySelector('output');
        rangeInput.value = params.inputValue;
        rangeInput.type = params.input;
        rangeOutput.value = params.inputValue;
        setInputLabel(rangeInput, range, params);
        return range;
      };

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

      renderInputType.radio = radio => {
        radio.textContent = '';
        return radio;
      };

      renderInputType.checkbox = (checkboxContainer, params) => {
        /** @type {HTMLInputElement} */
        const checkbox = getInput(getPopup(), 'checkbox');
        checkbox.value = '1';
        checkbox.id = swalClasses.checkbox;
        checkbox.checked = Boolean(params.inputValue);
        const label = checkboxContainer.querySelector('span');
        setInnerHtml(label, params.inputPlaceholder);
        return checkboxContainer;
      };

      renderInputType.textarea = (textarea, params) => {
        textarea.value = params.inputValue;
        setInputPlaceholder(textarea, params);
        setInputLabel(textarea, textarea, params);

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

      const renderFooter = (instance, params) => {
        const footer = getFooter();
        toggle(footer, params.footer);

        if (params.footer) {
          parseHtmlToContainer(params.footer, footer);
        } // Custom class


        applyCustomClass(footer, params, 'footer');
      };

      const renderCloseButton = (instance, params) => {
        const closeButton = getCloseButton();
        setInnerHtml(closeButton, params.closeButtonHtml); // Custom class

        applyCustomClass(closeButton, params, 'closeButton');
        toggle(closeButton, params.showCloseButton);
        closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
      };

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
          return hide(icon);
        }

        if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
          error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
          return hide(icon);
        }

        show(icon); // Custom or default content

        setContent(icon, params);
        applyStyles(icon, params); // Animate icon

        addClass(icon, params.showClass.icon);
      };

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
        const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');

        for (let i = 0; i < successIconParts.length; i++) {
          successIconParts[i].style.backgroundColor = popupBackgroundColor;
        }
      };

      const successIconHtml = "\n  <div class=\"swal2-success-circular-line-left\"></div>\n  <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n  <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n  <div class=\"swal2-success-circular-line-right\"></div>\n";
      const errorIconHtml = "\n  <span class=\"swal2-x-mark\">\n    <span class=\"swal2-x-mark-line-left\"></span>\n    <span class=\"swal2-x-mark-line-right\"></span>\n  </span>\n";

      const setContent = (icon, params) => {
        icon.textContent = '';

        if (params.iconHtml) {
          setInnerHtml(icon, iconContent(params.iconHtml));
        } else if (params.icon === 'success') {
          setInnerHtml(icon, successIconHtml);
        } else if (params.icon === 'error') {
          setInnerHtml(icon, errorIconHtml);
        } else {
          const defaultIconHtml = {
            question: '?',
            warning: '!',
            info: 'i'
          };
          setInnerHtml(icon, iconContent(defaultIconHtml[params.icon]));
        }
      };

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

      const iconContent = content => "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");

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

      const createStepElement = step => {
        const stepEl = document.createElement('li');
        addClass(stepEl, swalClasses['progress-step']);
        setInnerHtml(stepEl, step);
        return stepEl;
      };

      const createLineElement = params => {
        const lineEl = document.createElement('li');
        addClass(lineEl, swalClasses['progress-step-line']);

        if (params.progressStepsDistance) {
          lineEl.style.width = params.progressStepsDistance;
        }

        return lineEl;
      };

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
        const bodyChildren = toArray(document.body.children);
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
        const bodyChildren = toArray(document.body.children);
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
        toArray(templateContent.querySelectorAll('swal-param')).forEach(param => {
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
        toArray(templateContent.querySelectorAll('swal-button')).forEach(button => {
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

        const inputOptions = templateContent.querySelectorAll('swal-input-option');

        if (inputOptions.length) {
          result.inputOptions = {};
          toArray(inputOptions).forEach(option => {
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
        toArray(templateContent.children).forEach(el => {
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
        toArray(el.attributes).forEach(attribute => {
          if (allowedAttributes.indexOf(attribute.name) === -1) {
            warn(["Unrecognized attribute \"".concat(attribute.name, "\" on <").concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(', ')) : 'To set the value, use HTML within the element.')]);
          }
        });
      };

      var defaultInputValidators = {
        email: (string, validationMessage) => {
          return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
        },
        url: (string, validationMessage) => {
          // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
          return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
        }
      };

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
       * @param params
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
        popup.setAttribute('data-loading', true);
        popup.setAttribute('aria-busy', true);
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
       * Instance method to close sweetAlert
       */

      function removePopupAndResetState(instance, container, returnFocus, didClose) {
        if (isToast()) {
          triggerDidCloseAndDispose(instance, didClose);
        } else {
          restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
          globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
            capture: globalState.keydownListenerCapture
          });
          globalState.keydownHandlerAdded = false;
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
            warn("Invalid parameter to update: \"".concat(param, "\". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js\n\nIf you think this parameter should be updatable, request it here: https://github.com/sweetalert2/sweetalert2/issues/new?template=02_feature_request.md"));
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
        } // Check if there is a swal disposal defer timer


        if (globalState.deferDisposalTimer) {
          clearTimeout(globalState.deferDisposalTimer);
          delete globalState.deferDisposalTimer;
        }

        if (typeof innerParams.didDestroy === 'function') {
          innerParams.didDestroy();
        }

        disposeSwal(this);
      }

      const disposeSwal = instance => {
        disposeWeakMaps(instance); // Unset this.params so GC will dispose it (#1569)

        delete instance.params; // Unset globalState props so GC will dispose globalState (#1569)

        delete globalState.keydownHandler;
        delete globalState.keydownTarget; // Unset currentInstance

        delete globalState.currentInstance;
      };

      const disposeWeakMaps = instance => {
        // If the current instance is awaiting a promise result, we keep the privateMethods to call them once the promise result is retrieved #2335
        if (instance.isAwaitingPromise()) {
          unsetWeakMaps(privateProps, instance);
          privateProps.awaitingPromise.set(instance, true);
        } else {
          unsetWeakMaps(privateMethods, instance);
          unsetWeakMaps(privateProps, instance);
        }
      };

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

      const handleConfirmButtonClick = instance => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();

        if (innerParams.input) {
          handleConfirmOrDenyWithInput(instance, 'confirm');
        } else {
          confirm(instance, true);
        }
      };
      const handleDenyButtonClick = instance => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();

        if (innerParams.returnInputValueOnDeny) {
          handleConfirmOrDenyWithInput(instance, 'deny');
        } else {
          deny(instance, false);
        }
      };
      const handleCancelButtonClick = (instance, dismissWith) => {
        instance.disableButtons();
        dismissWith(DismissReason.cancel);
      };

      const handleConfirmOrDenyWithInput = (instance, type
      /* 'confirm' | 'deny' */
      ) => {
        const innerParams = privateProps.innerParams.get(instance);

        if (!innerParams.input) {
          return error("The \"input\" parameter is needed to be set when using returnInputValueOn".concat(capitalizeFirstLetter(type)));
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

      const handleInputValidator = (instance, inputValue, type
      /* 'confirm' | 'deny' */
      ) => {
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
              instance.closePopup({
                isDenied: true,
                value: typeof preDenyValue === 'undefined' ? value : preDenyValue
              });
            }
          }).catch(error$$1 => rejectWith(instance || undefined, error$$1));
        } else {
          instance.closePopup({
            isDenied: true,
            value
          });
        }
      };

      const succeedWith = (instance, value) => {
        instance.closePopup({
          isConfirmed: true,
          value
        });
      };

      const rejectWith = (instance, error$$1) => {
        instance.rejectPromise(error$$1);
      };

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

      const addKeydownHandler = (instance, globalState, innerParams, dismissWith) => {
        if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
          globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
            capture: globalState.keydownListenerCapture
          });
          globalState.keydownHandlerAdded = false;
        }

        if (!innerParams.toast) {
          globalState.keydownHandler = e => keydownHandler(instance, e, dismissWith);

          globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
          globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
          globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
            capture: globalState.keydownListenerCapture
          });
          globalState.keydownHandlerAdded = true;
        }
      }; // Focus handling

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

      const handleEnter = (instance, e, innerParams) => {
        // https://github.com/sweetalert2/sweetalert2/issues/2386
        if (!callIfFunction(innerParams.allowEnterKey)) {
          return;
        }

        if (e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
          if (['textarea', 'file'].includes(innerParams.input)) {
            return; // do not submit
          }

          clickConfirm();
          e.preventDefault();
        }
      };

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

      const handleArrows = key => {
        const confirmButton = getConfirmButton();
        const denyButton = getDenyButton();
        const cancelButton = getCancelButton();

        if (![confirmButton, denyButton, cancelButton].includes(document.activeElement)) {
          return;
        }

        const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling';
        let buttonToFocus = document.activeElement;

        for (let i = 0; i < getActions().children.length; i++) {
          buttonToFocus = buttonToFocus[sibling];

          if (!buttonToFocus) {
            return;
          }

          if (isVisible(buttonToFocus) && buttonToFocus instanceof HTMLButtonElement) {
            break;
          }
        }

        if (buttonToFocus instanceof HTMLButtonElement) {
          buttonToFocus.focus();
        }
      };

      const handleEsc = (e, innerParams, dismissWith) => {
        if (callIfFunction(innerParams.allowEscapeKey)) {
          e.preventDefault();
          dismissWith(DismissReason.esc);
        }
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

          const promise = this._main(this.params);

          privateProps.promise.set(this, promise);
        }

        _main(userParams) {
          let mixinParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          showWarningsForParams(Object.assign({}, mixinParams, userParams));

          if (globalState.currentInstance) {
            globalState.currentInstance._destroy();

            if (isModal()) {
              unsetAriaHidden();
            }
          }

          globalState.currentInstance = this;
          const innerParams = prepareParams(userParams, mixinParams);
          setParameters(innerParams);
          Object.freeze(innerParams); // clear the previous timer

          if (globalState.timeout) {
            globalState.timeout.stop();
            delete globalState.timeout;
          } // clear the restore focus timeout


          clearTimeout(globalState.restoreFocusTimeout);
          const domCache = populateDomCache(this);
          render(this, innerParams);
          privateProps.innerParams.set(this, innerParams);
          return swalPromise(this, domCache, innerParams);
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
      }; // Assign instance methods from src/instanceMethods/*.js to prototype


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
      SweetAlert.version = '11.4.4';

      const Swal = SweetAlert; // @ts-ignore

      Swal.default = Swal;

      return Swal;

    }));
    if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal.Sweetalert2){  commonjsGlobal.swal = commonjsGlobal.sweetAlert = commonjsGlobal.Swal = commonjsGlobal.SweetAlert = commonjsGlobal.Sweetalert2;}

    "undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t;}catch(e){n.innerText=t;}}(document,".swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4!important;grid-row:1/4!important;grid-template-columns:1fr 99fr 1fr;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:grid;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto);grid-template-rows:minmax(min-content,auto) minmax(min-content,auto) minmax(min-content,auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-bottom-start,.swal2-container.swal2-center-start,.swal2-container.swal2-top-start{grid-template-columns:minmax(0,1fr) auto auto}.swal2-container.swal2-bottom,.swal2-container.swal2-center,.swal2-container.swal2-top{grid-template-columns:auto minmax(0,1fr) auto}.swal2-container.swal2-bottom-end,.swal2-container.swal2-center-end,.swal2-container.swal2-top-end{grid-template-columns:auto auto minmax(0,1fr)}.swal2-container.swal2-top-start>.swal2-popup{align-self:start}.swal2-container.swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}.swal2-container.swal2-top-end>.swal2-popup,.swal2-container.swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}.swal2-container.swal2-center-left>.swal2-popup,.swal2-container.swal2-center-start>.swal2-popup{grid-row:2;align-self:center}.swal2-container.swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}.swal2-container.swal2-center-end>.swal2-popup,.swal2-container.swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}.swal2-container.swal2-bottom-left>.swal2-popup,.swal2-container.swal2-bottom-start>.swal2-popup{grid-column:1;grid-row:3;align-self:end}.swal2-container.swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}.swal2-container.swal2-bottom-end>.swal2-popup,.swal2-container.swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}.swal2-container.swal2-grow-fullscreen>.swal2-popup,.swal2-container.swal2-grow-row>.swal2-popup{grid-column:1/4;width:100%}.swal2-container.swal2-grow-column>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}.swal2-container.swal2-no-transition{transition:none!important}.swal2-popup{display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0,100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-title{position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px transparent;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}.swal2-styled.swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}.swal2-styled.swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled:focus{outline:0}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto!important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:2em auto 1em}.swal2-close{z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:0 0;color:#ccc;font-family:serif;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close:focus{outline:0;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em 2em 3px}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px transparent;color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em 2em 3px;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-file{width:75%;margin-right:auto;margin-left:auto;background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto 0}.swal2-validation-message{align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-warning.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-i-mark .5s;animation:swal2-animate-i-mark .5s}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-info.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-i-mark .8s;animation:swal2-animate-i-mark .8s}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-question.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-question-mark .8s;animation:swal2-animate-question-mark .8s}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@-webkit-keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@-webkit-keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{background-color:transparent!important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:transparent;pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}");
    });

    /* src/Snippets/Breadcrumb.svelte generated by Svelte v3.46.4 */
    const file$p = "src/Snippets/Breadcrumb.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (32:4) {#if path.length > 0}
    function create_if_block_1$3(ctx) {
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
    			add_location(i, file$p, 34, 52, 1226);
    			add_location(u, file$p, 34, 49, 1223);
    			attr_dev(a, "class", "font-w300 cursor-pointer");
    			add_location(a, file$p, 32, 8, 1133);
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
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(32:4) {#if path.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (43:8) {:else}
    function create_else_block$4(ctx) {
    	let span;
    	let t_value = /*pItem*/ ctx[3].replace('/', '') + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "font-w600");
    			add_location(span, file$p, 43, 12, 1576);
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
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(43:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:8) {#if idx < path.length - 1}
    function create_if_block$5(ctx) {
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
    			add_location(u, file$p, 41, 53, 1510);
    			attr_dev(a, "class", "font-w300 cursor-pointer");
    			add_location(a, file$p, 39, 12, 1411);
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(38:8) {#if idx < path.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#each path as pItem, idx}
    function create_each_block$3(ctx) {
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (/*idx*/ ctx[5] < /*path*/ ctx[0].length - 1) return create_if_block$5;
    		return create_else_block$4;
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(37:4) {#each path as pItem, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let if_block = /*path*/ ctx[0].length > 0 && create_if_block_1$3(ctx);
    	let each_value = /*path*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("📍\r\n    ");
    			if (if_block) if_block.c();
    			t1 = text(" / \r\n    ");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "font-w100");
    			set_style(p, "float", "left");
    			add_location(p, file$p, 28, 0, 995);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			if (if_block) if_block.m(p, null);
    			append_dev(p, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(p, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*path*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(p, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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
    						each_blocks[i].m(p, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
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
    	validate_slots('Breadcrumb', slots, []);
    	let { path = [] } = $$props;
    	const dispatch = createEventDispatcher();

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
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { path: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Breadcrumb",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get path() {
    		throw new Error("<Breadcrumb>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Breadcrumb>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Snippets/ContextMenu.svelte generated by Svelte v3.46.4 */
    const file$o = "src/Snippets/ContextMenu.svelte";

    // (88:4) {:else}
    function create_else_block$3(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div2;
    	let t5;
    	let div3;
    	let t7;
    	let div4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Properties";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "Cut";
    			t3 = space();
    			div2 = element("div");
    			div2.textContent = "Copy";
    			t5 = space();
    			div3 = element("div");
    			div3.textContent = "Rename";
    			t7 = space();
    			div4 = element("div");
    			div4.textContent = "Delete";
    			attr_dev(div0, "class", "dropdown-item divider");
    			add_location(div0, file$o, 88, 8, 2748);
    			attr_dev(div1, "class", "dropdown-item");
    			add_location(div1, file$o, 91, 8, 2873);
    			attr_dev(div2, "class", "dropdown-item divider");
    			add_location(div2, file$o, 94, 8, 2984);
    			attr_dev(div3, "class", "dropdown-item");
    			add_location(div3, file$o, 99, 8, 3139);
    			attr_dev(div4, "class", "dropdown-item");
    			add_location(div4, file$o, 100, 8, 3222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div3, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div4, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", stop_propagation(/*toProperties*/ ctx[5]), false, false, true),
    					listen_dev(div1, "click", stop_propagation(/*toPaste*/ ctx[4](true)), false, false, true),
    					listen_dev(div2, "click", stop_propagation(/*toPaste*/ ctx[4](false)), false, false, true),
    					listen_dev(div3, "click", stop_propagation(/*rename*/ ctx[2]), false, false, true),
    					listen_dev(div4, "click", stop_propagation(/*del*/ ctx[3]), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(88:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (84:23) 
    function create_if_block_1$2(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Properties";
    			attr_dev(div, "class", "dropdown-item");
    			add_location(div, file$o, 84, 8, 2618);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", stop_propagation(/*toProperties*/ ctx[5]), false, false, true);
    				mounted = true;
    			}
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(84:23) ",
    		ctx
    	});

    	return block;
    }

    // (82:4) {#if item.isDir && item.name == '../'}
    function create_if_block$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Special dir";
    			attr_dev(div, "class", "dropdown-item text-grey");
    			add_location(div, file$o, 82, 8, 2529);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(82:4) {#if item.isDir && item.name == '../'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[0].isDir && /*item*/ ctx[0].name == '../') return create_if_block$4;
    		if (/*readOnly*/ ctx[1]) return create_if_block_1$2;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "dropdown-content dd-cnt-fix dropdown-right white shadow-1 rounded-3");
    			add_location(div, file$o, 79, 0, 2385);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
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
    	validate_slots('ContextMenu', slots, []);
    	let { item } = $$props;
    	let { readOnly } = $$props;
    	const dispatch = createEventDispatcher();

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
    	}

    	function toPaste(isCut) {
    		return function () {
    			dispatch("toPaste", { file: item, isCut });
    		};
    	}

    	function toProperties() {
    		dispatch("openPropsModal", { file: item });
    	}

    	const writable_props = ['item', 'readOnly'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContextMenu> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Swal: sweetalert2_all,
    		item,
    		readOnly,
    		dispatch,
    		rename,
    		del,
    		toPaste,
    		toProperties
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, readOnly, rename, del, toPaste, toProperties];
    }

    class ContextMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { item: 0, readOnly: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContextMenu",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<ContextMenu> was created without expected prop 'item'");
    		}

    		if (/*readOnly*/ ctx[1] === undefined && !('readOnly' in props)) {
    			console.warn("<ContextMenu> was created without expected prop 'readOnly'");
    		}
    	}

    	get item() {
    		throw new Error("<ContextMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ContextMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readOnly() {
    		throw new Error("<ContextMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readOnly(value) {
    		throw new Error("<ContextMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Snippets/DotDotDot.svelte generated by Svelte v3.46.4 */

    const file$n = "src/Snippets/DotDotDot.svelte";

    function create_fragment$n(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = " ··· ";
    			attr_dev(span, "class", "font-w600 cursor-pointer bd-1 bd-solid bd-grey bd-light-3 grey light-4 rounded-1");
    			add_location(span, file$n, 18, 0, 748);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$2,
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
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

    function instance$n($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DotDotDot', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DotDotDot> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class DotDotDot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DotDotDot",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/FileManager/GridCell.svelte generated by Svelte v3.46.4 */
    const file$m = "src/FileManager/GridCell.svelte";

    function create_fragment$m(ctx) {
    	let div6;
    	let div5;
    	let span0;
    	let t0_value = /*item*/ ctx[0].size + "";
    	let t0;
    	let t1;
    	let div0;
    	let span1;
    	let dotdotdot;
    	let span1_data_target_value;
    	let t2;
    	let contextmenu;
    	let div0_id_value;
    	let t3;
    	let div1;
    	let t5;
    	let div2;
    	let img;
    	let img_alt_value;
    	let img_src_value;
    	let t6;
    	let div3;
    	let t8;
    	let div4;
    	let t9_value = /*item*/ ctx[0].name + "";
    	let t9;
    	let current;
    	let mounted;
    	let dispose;
    	dotdotdot = new DotDotDot({ $$inline: true });

    	contextmenu = new ContextMenu({
    			props: {
    				item: /*item*/ ctx[0],
    				readOnly: /*readOnly*/ ctx[1]
    			},
    			$$inline: true
    		});

    	contextmenu.$on("toPaste", /*toPaste_handler*/ ctx[2]);
    	contextmenu.$on("reload", /*reload_handler*/ ctx[3]);
    	contextmenu.$on("openPropsModal", /*openPropsModal_handler*/ ctx[4]);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div5 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			create_component(dotdotdot.$$.fragment);
    			t2 = space();
    			create_component(contextmenu.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			div1.textContent = " ";
    			t5 = space();
    			div2 = element("div");
    			img = element("img");
    			t6 = space();
    			div3 = element("div");
    			div3.textContent = " ";
    			t8 = space();
    			div4 = element("div");
    			t9 = text(t9_value);
    			attr_dev(span0, "class", "font-w100 hide-sm-down");
    			add_location(span0, file$m, 36, 8, 1337);
    			attr_dev(span1, "data-target", span1_data_target_value = "ddGrid-" + /*item*/ ctx[0].uuid);
    			add_location(span1, file$m, 38, 6, 1485);
    			attr_dev(div0, "class", "dropdown dd-fix");
    			attr_dev(div0, "id", div0_id_value = "ddGrid-" + /*item*/ ctx[0].uuid);
    			set_style(div0, "float", "right");
    			add_location(div0, file$m, 37, 8, 1402);
    			set_style(div1, "clear", "both");
    			add_location(div1, file$m, 43, 8, 1704);
    			attr_dev(img, "alt", img_alt_value = /*item*/ ctx[0].icon);
    			if (!src_url_equal(img.src, img_src_value = "icons/48x48/" + /*item*/ ctx[0].icon + ".svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$m, 45, 12, 1799);
    			attr_dev(div2, "class", "font-s9 text-center");
    			add_location(div2, file$m, 44, 8, 1752);
    			add_location(div3, file$m, 47, 8, 1881);
    			attr_dev(div4, "class", "text-center ellipsis");
    			add_location(div4, file$m, 48, 8, 1908);
    			attr_dev(div5, "class", "card-content lh-1");
    			add_location(div5, file$m, 35, 4, 1296);
    			attr_dev(div6, "class", "card shadow-1 hoverable-1 rounded-3 overflow-visible white");
    			add_location(div6, file$m, 33, 0, 1170);
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
    			mount_component(dotdotdot, span1, null);
    			append_dev(div0, t2);
    			mount_component(contextmenu, div0, null);
    			append_dev(div5, t3);
    			append_dev(div5, div1);
    			append_dev(div5, t5);
    			append_dev(div5, div2);
    			append_dev(div2, img);
    			append_dev(div5, t6);
    			append_dev(div5, div3);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, t9);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span1, "click", stop_propagation(noop$1), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*item*/ 1) && t0_value !== (t0_value = /*item*/ ctx[0].size + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*item*/ 1 && span1_data_target_value !== (span1_data_target_value = "ddGrid-" + /*item*/ ctx[0].uuid)) {
    				attr_dev(span1, "data-target", span1_data_target_value);
    			}

    			const contextmenu_changes = {};
    			if (dirty & /*item*/ 1) contextmenu_changes.item = /*item*/ ctx[0];
    			if (dirty & /*readOnly*/ 2) contextmenu_changes.readOnly = /*readOnly*/ ctx[1];
    			contextmenu.$set(contextmenu_changes);

    			if (!current || dirty & /*item*/ 1 && div0_id_value !== (div0_id_value = "ddGrid-" + /*item*/ ctx[0].uuid)) {
    				attr_dev(div0, "id", div0_id_value);
    			}

    			if (!current || dirty & /*item*/ 1 && img_alt_value !== (img_alt_value = /*item*/ ctx[0].icon)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (!current || dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = "icons/48x48/" + /*item*/ ctx[0].icon + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*item*/ 1) && t9_value !== (t9_value = /*item*/ ctx[0].name + "")) set_data_dev(t9, t9_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dotdotdot.$$.fragment, local);
    			transition_in(contextmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dotdotdot.$$.fragment, local);
    			transition_out(contextmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(dotdotdot);
    			destroy_component(contextmenu);
    			mounted = false;
    			dispose();
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

    function noop$1() {
    	
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GridCell', slots, []);
    	let { item } = $$props;
    	let { readOnly } = $$props;

    	onMount(() => {
    		new Dropdown("#ddGrid-" + item.uuid);
    	});

    	onDestroy(() => {
    		destroy("#ddGrid-" + item.uuid);
    	});

    	const writable_props = ['item', 'readOnly'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GridCell> was created with unknown prop '${key}'`);
    	});

    	function toPaste_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function reload_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function openPropsModal_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	$$self.$capture_state = () => ({
    		ContextMenu,
    		onMount,
    		onDestroy,
    		Dropdown,
    		destroy,
    		DotDotDot,
    		item,
    		readOnly,
    		noop: noop$1
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, readOnly, toPaste_handler, reload_handler, openPropsModal_handler];
    }

    class GridCell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { item: 0, readOnly: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GridCell",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<GridCell> was created without expected prop 'item'");
    		}

    		if (/*readOnly*/ ctx[1] === undefined && !('readOnly' in props)) {
    			console.warn("<GridCell> was created without expected prop 'readOnly'");
    		}
    	}

    	get item() {
    		throw new Error("<GridCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<GridCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readOnly() {
    		throw new Error("<GridCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readOnly(value) {
    		throw new Error("<GridCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FileManager/Grid.svelte generated by Svelte v3.46.4 */
    const file$l = "src/FileManager/Grid.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (32:4) {#each itemList as item, i (item.uuid)}
    function create_each_block$2(key_1, ctx) {
    	let div;
    	let gridcell;
    	let t;
    	let div_title_value;
    	let current;
    	let mounted;
    	let dispose;

    	gridcell = new GridCell({
    			props: {
    				item: /*item*/ ctx[7],
    				readOnly: /*readOnly*/ ctx[1]
    			},
    			$$inline: true
    		});

    	gridcell.$on("toPaste", /*toPaste_handler*/ ctx[3]);
    	gridcell.$on("reload", /*reload_handler*/ ctx[4]);
    	gridcell.$on("openPropsModal", /*openPropsModal_handler*/ ctx[5]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(gridcell.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "m-3 cursor-pointer");
    			attr_dev(div, "title", div_title_value = /*item*/ ctx[7].name);
    			set_style(div, "z-index", /*itemList*/ ctx[0].length + 1 - /*i*/ ctx[9]);
    			add_location(div, file$l, 34, 8, 1265);
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
    						if (is_function(/*click*/ ctx[2](/*item*/ ctx[7].uuid))) /*click*/ ctx[2](/*item*/ ctx[7].uuid).apply(this, arguments);
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
    			if (dirty & /*itemList*/ 1) gridcell_changes.item = /*item*/ ctx[7];
    			if (dirty & /*readOnly*/ 2) gridcell_changes.readOnly = /*readOnly*/ ctx[1];
    			gridcell.$set(gridcell_changes);

    			if (!current || dirty & /*itemList*/ 1 && div_title_value !== (div_title_value = /*item*/ ctx[7].name)) {
    				attr_dev(div, "title", div_title_value);
    			}

    			if (!current || dirty & /*itemList*/ 1) {
    				set_style(div, "z-index", /*itemList*/ ctx[0].length + 1 - /*i*/ ctx[9]);
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
    		source: "(32:4) {#each itemList as item, i (item.uuid)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*itemList*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[7].uuid;
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

    			attr_dev(div, "class", "grix xs2 sm3 md4 lg6 xl12");
    			add_location(div, file$l, 30, 0, 1040);
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
    			if (dirty & /*itemList, click, readOnly*/ 7) {
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, []);
    	let { itemList } = $$props;
    	let { readOnly } = $$props;
    	const dispatch = createEventDispatcher();

    	function click(uuid) {
    		return e => {
    			dispatch("message", { uuid });
    		};
    	}

    	const writable_props = ['itemList', 'readOnly'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	function toPaste_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function reload_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function openPropsModal_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('itemList' in $$props) $$invalidate(0, itemList = $$props.itemList);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		GridCell,
    		itemList,
    		readOnly,
    		dispatch,
    		click
    	});

    	$$self.$inject_state = $$props => {
    		if ('itemList' in $$props) $$invalidate(0, itemList = $$props.itemList);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		itemList,
    		readOnly,
    		click,
    		toPaste_handler,
    		reload_handler,
    		openPropsModal_handler
    	];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { itemList: 0, readOnly: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*itemList*/ ctx[0] === undefined && !('itemList' in props)) {
    			console.warn("<Grid> was created without expected prop 'itemList'");
    		}

    		if (/*readOnly*/ ctx[1] === undefined && !('readOnly' in props)) {
    			console.warn("<Grid> was created without expected prop 'readOnly'");
    		}
    	}

    	get itemList() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemList(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readOnly() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readOnly(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FileManager/ListRow.svelte generated by Svelte v3.46.4 */
    const file$k = "src/FileManager/ListRow.svelte";

    function create_fragment$k(ctx) {
    	let tr;
    	let td0;
    	let div0;
    	let img0;
    	let img0_alt_value;
    	let img0_src_value;
    	let t0;
    	let span0;
    	let t1_value = /*item*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let div1;
    	let img1;
    	let img1_alt_value;
    	let img1_src_value;
    	let t3;
    	let span1;
    	let t4_value = /*item*/ ctx[0].name + "";
    	let t4;
    	let t5;
    	let td1;
    	let t6_value = /*item*/ ctx[0].size + "";
    	let t6;
    	let t7;
    	let td2;
    	let t8_value = /*item*/ ctx[0].chDate + "";
    	let t8;
    	let t9;
    	let td3;
    	let div2;
    	let span2;
    	let dotdotdot;
    	let span2_data_target_value;
    	let t10;
    	let contextmenu;
    	let div2_id_value;
    	let current;
    	let mounted;
    	let dispose;
    	dotdotdot = new DotDotDot({ $$inline: true });

    	contextmenu = new ContextMenu({
    			props: {
    				item: /*item*/ ctx[0],
    				readOnly: /*readOnly*/ ctx[1]
    			},
    			$$inline: true
    		});

    	contextmenu.$on("toPaste", /*toPaste_handler*/ ctx[3]);
    	contextmenu.$on("reload", /*reload_handler*/ ctx[4]);
    	contextmenu.$on("openPropsModal", /*openPropsModal_handler*/ ctx[5]);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = text(" ");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t3 = text(" ");
    			span1 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			td1 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td2 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td3 = element("td");
    			div2 = element("div");
    			span2 = element("span");
    			create_component(dotdotdot.$$.fragment);
    			t10 = space();
    			create_component(contextmenu.$$.fragment);
    			attr_dev(img0, "alt", img0_alt_value = /*item*/ ctx[0].icon);
    			attr_dev(img0, "class", "txt-mid svelte-1hc0msy");
    			if (!src_url_equal(img0.src, img0_src_value = "icons/16x16/" + /*item*/ ctx[0].icon + ".svg")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$k, 51, 12, 1595);
    			attr_dev(span0, "class", "txt-mid svelte-1hc0msy");
    			add_location(span0, file$k, 51, 90, 1673);
    			attr_dev(div0, "class", "cursor-pointer wid220 ellipsis hide-md-up");
    			add_location(div0, file$k, 50, 8, 1526);
    			attr_dev(img1, "alt", img1_alt_value = /*item*/ ctx[0].icon);
    			attr_dev(img1, "class", "txt-mid svelte-1hc0msy");
    			if (!src_url_equal(img1.src, img1_src_value = "icons/16x16/" + /*item*/ ctx[0].icon + ".svg")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$k, 55, 12, 1811);
    			attr_dev(span1, "class", "txt-mid svelte-1hc0msy");
    			add_location(span1, file$k, 55, 90, 1889);
    			attr_dev(div1, "class", "cursor-pointer hide-sm-down");
    			add_location(div1, file$k, 54, 8, 1756);
    			add_location(td0, file$k, 49, 4, 1484);
    			add_location(td1, file$k, 59, 4, 1979);
    			attr_dev(td2, "class", "hide-sm-down");
    			add_location(td2, file$k, 60, 4, 2005);
    			attr_dev(span2, "data-target", span2_data_target_value = "ddList-" + /*item*/ ctx[0].uuid);
    			add_location(span2, file$k, 63, 6, 2134);
    			attr_dev(div2, "class", "w100 dropdown dd-fix");
    			attr_dev(div2, "id", div2_id_value = "ddList-" + /*item*/ ctx[0].uuid);
    			add_location(div2, file$k, 62, 8, 2068);
    			add_location(td3, file$k, 61, 4, 2054);
    			add_location(tr, file$k, 48, 0, 1474);
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
    			append_dev(td0, t2);
    			append_dev(td0, div1);
    			append_dev(div1, img1);
    			append_dev(div1, t3);
    			append_dev(div1, span1);
    			append_dev(span1, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td1);
    			append_dev(td1, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td2);
    			append_dev(td2, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td3);
    			append_dev(td3, div2);
    			append_dev(div2, span2);
    			mount_component(dotdotdot, span2, null);
    			append_dev(div2, t10);
    			mount_component(contextmenu, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						td0,
    						"click",
    						function () {
    							if (is_function(/*click*/ ctx[2](/*item*/ ctx[0].uuid))) /*click*/ ctx[2](/*item*/ ctx[0].uuid).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(span2, "click", stop_propagation(noop), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (!current || dirty & /*item*/ 1 && img0_alt_value !== (img0_alt_value = /*item*/ ctx[0].icon)) {
    				attr_dev(img0, "alt", img0_alt_value);
    			}

    			if (!current || dirty & /*item*/ 1 && !src_url_equal(img0.src, img0_src_value = "icons/16x16/" + /*item*/ ctx[0].icon + ".svg")) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if ((!current || dirty & /*item*/ 1) && t1_value !== (t1_value = /*item*/ ctx[0].name + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*item*/ 1 && img1_alt_value !== (img1_alt_value = /*item*/ ctx[0].icon)) {
    				attr_dev(img1, "alt", img1_alt_value);
    			}

    			if (!current || dirty & /*item*/ 1 && !src_url_equal(img1.src, img1_src_value = "icons/16x16/" + /*item*/ ctx[0].icon + ".svg")) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if ((!current || dirty & /*item*/ 1) && t4_value !== (t4_value = /*item*/ ctx[0].name + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*item*/ 1) && t6_value !== (t6_value = /*item*/ ctx[0].size + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*item*/ 1) && t8_value !== (t8_value = /*item*/ ctx[0].chDate + "")) set_data_dev(t8, t8_value);

    			if (!current || dirty & /*item*/ 1 && span2_data_target_value !== (span2_data_target_value = "ddList-" + /*item*/ ctx[0].uuid)) {
    				attr_dev(span2, "data-target", span2_data_target_value);
    			}

    			const contextmenu_changes = {};
    			if (dirty & /*item*/ 1) contextmenu_changes.item = /*item*/ ctx[0];
    			if (dirty & /*readOnly*/ 2) contextmenu_changes.readOnly = /*readOnly*/ ctx[1];
    			contextmenu.$set(contextmenu_changes);

    			if (!current || dirty & /*item*/ 1 && div2_id_value !== (div2_id_value = "ddList-" + /*item*/ ctx[0].uuid)) {
    				attr_dev(div2, "id", div2_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dotdotdot.$$.fragment, local);
    			transition_in(contextmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dotdotdot.$$.fragment, local);
    			transition_out(contextmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(dotdotdot);
    			destroy_component(contextmenu);
    			mounted = false;
    			run_all(dispose);
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

    function noop() {
    	
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListRow', slots, []);
    	let { item } = $$props;
    	let { readOnly } = $$props;
    	const dispatch = createEventDispatcher();

    	onMount(() => {
    		new Dropdown("#ddList-" + item.uuid);
    	});

    	onDestroy(() => {
    		destroy("#ddList-" + item.uuid);
    	});

    	function click(uuid) {
    		return e => {
    			dispatch("message", { uuid });
    		};
    	}

    	const writable_props = ['item', 'readOnly'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ListRow> was created with unknown prop '${key}'`);
    	});

    	function toPaste_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function reload_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function openPropsModal_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		Dropdown,
    		destroy,
    		ContextMenu,
    		DotDotDot,
    		item,
    		readOnly,
    		dispatch,
    		click,
    		noop
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, readOnly, click, toPaste_handler, reload_handler, openPropsModal_handler];
    }

    class ListRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { item: 0, readOnly: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListRow",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<ListRow> was created without expected prop 'item'");
    		}

    		if (/*readOnly*/ ctx[1] === undefined && !('readOnly' in props)) {
    			console.warn("<ListRow> was created without expected prop 'readOnly'");
    		}
    	}

    	get item() {
    		throw new Error("<ListRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ListRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readOnly() {
    		throw new Error("<ListRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readOnly(value) {
    		throw new Error("<ListRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FileManager/List.svelte generated by Svelte v3.46.4 */
    const file$j = "src/FileManager/List.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (30:8) {#each itemList as item (item.uuid)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let listrow;
    	let current;

    	listrow = new ListRow({
    			props: {
    				item: /*item*/ ctx[6],
    				readOnly: /*readOnly*/ ctx[1]
    			},
    			$$inline: true
    		});

    	listrow.$on("message", /*message_handler*/ ctx[2]);
    	listrow.$on("toPaste", /*toPaste_handler*/ ctx[3]);
    	listrow.$on("reload", /*reload_handler*/ ctx[4]);
    	listrow.$on("openPropsModal", /*openPropsModal_handler*/ ctx[5]);

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
    			if (dirty & /*itemList*/ 1) listrow_changes.item = /*item*/ ctx[6];
    			if (dirty & /*readOnly*/ 2) listrow_changes.readOnly = /*readOnly*/ ctx[1];
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
    		source: "(30:8) {#each itemList as item (item.uuid)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let table;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t6;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*itemList*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[6].uuid;
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
    			th0.textContent = "Name";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Size";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Mod. Date";
    			t5 = space();
    			th3 = element("th");
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$j, 24, 12, 920);
    			add_location(th1, file$j, 25, 12, 947);
    			attr_dev(th2, "class", "hide-sm-down");
    			add_location(th2, file$j, 26, 12, 974);
    			add_location(th3, file$j, 27, 12, 1027);
    			add_location(tr, file$j, 23, 8, 902);
    			attr_dev(table, "class", "table");
    			add_location(table, file$j, 22, 4, 871);
    			attr_dev(div, "class", "table-responsive w100");
    			add_location(div, file$j, 21, 0, 830);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(table, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*itemList, readOnly*/ 3) {
    				each_value = /*itemList*/ ctx[0];
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
    	validate_slots('List', slots, []);
    	let { itemList } = $$props;
    	let { readOnly } = $$props;
    	const writable_props = ['itemList', 'readOnly'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	function message_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function toPaste_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function reload_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function openPropsModal_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('itemList' in $$props) $$invalidate(0, itemList = $$props.itemList);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	$$self.$capture_state = () => ({ ListRow, itemList, readOnly });

    	$$self.$inject_state = $$props => {
    		if ('itemList' in $$props) $$invalidate(0, itemList = $$props.itemList);
    		if ('readOnly' in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		itemList,
    		readOnly,
    		message_handler,
    		toPaste_handler,
    		reload_handler,
    		openPropsModal_handler
    	];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { itemList: 0, readOnly: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*itemList*/ ctx[0] === undefined && !('itemList' in props)) {
    			console.warn("<List> was created without expected prop 'itemList'");
    		}

    		if (/*readOnly*/ ctx[1] === undefined && !('readOnly' in props)) {
    			console.warn("<List> was created without expected prop 'readOnly'");
    		}
    	}

    	get itemList() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemList(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readOnly() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readOnly(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/SVG/IconGrid.svelte generated by Svelte v3.46.4 */

    const file$i = "src/SVG/IconGrid.svelte";

    function create_fragment$i(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M3 11H11V3H3M5 5H9V9H5M13 21H21V13H13M15 15H19V19H15M3 21H11V13H3M5 15H9V19H5M13 3V11H21V3M19 9H15V5H19Z");
    			add_location(path, file$i, 12, 4, 349);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$i, 5, 0, 137);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconGrid",
    			options,
    			id: create_fragment$i.name
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

    /* src/SVG/IconList.svelte generated by Svelte v3.46.4 */

    const file$h = "src/SVG/IconList.svelte";

    function create_fragment$h(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8V5H4M4,19H8V15H4M4,14H8V10H4V14Z");
    			add_location(path, file$h, 12, 4, 349);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$h, 5, 0, 137);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconList",
    			options,
    			id: create_fragment$h.name
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

    /* src/SVG/IconSortAlphAsc.svelte generated by Svelte v3.46.4 */

    const file$g = "src/SVG/IconSortAlphAsc.svelte";

    function create_fragment$g(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19 17H22L18 21L14 17H17V3H19M11 13V15L7.67 19H11V21H5V19L8.33 15H5V13M9 3H7C5.9 3 5 3.9 5 5V11H7V9H9V11H11V5C11 3.9 10.11 3 9 3M9 7H7V5H9Z");
    			add_location(path, file$g, 12, 4, 367);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$g, 5, 0, 155);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortAlphAsc",
    			options,
    			id: create_fragment$g.name
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

    /* src/SVG/IconSortAlphDesc.svelte generated by Svelte v3.46.4 */

    const file$f = "src/SVG/IconSortAlphDesc.svelte";

    function create_fragment$f(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19 7H22L18 3L14 7H17V21H19M11 13V15L7.67 19H11V21H5V19L8.33 15H5V13M9 3H7C5.9 3 5 3.9 5 5V11H7V9H9V11H11V5C11 3.9 10.11 3 9 3M9 7H7V5H9Z");
    			add_location(path, file$f, 12, 4, 368);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$f, 5, 0, 156);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortAlphDesc",
    			options,
    			id: create_fragment$f.name
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

    /* src/SVG/IconSortDateAsc.svelte generated by Svelte v3.46.4 */

    const file$e = "src/SVG/IconSortDateAsc.svelte";

    function create_fragment$e(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M21 17H24L20 21L16 17H19V3H21V17M8 16H11V13H8V16M13 5H12V3H10V5H6V3H4V5H3C1.89 5 1 5.89 1 7V18C1 19.11 1.89 20 3 20H13C14.11 20 15 19.11 15 18V7C15 5.89 14.11 5 13 5M3 18L3 11H13L13 18L3 18Z");
    			add_location(path, file$e, 12, 4, 363);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$e, 5, 0, 151);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortDateAsc",
    			options,
    			id: create_fragment$e.name
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

    /* src/SVG/IconSortDateDesc.svelte generated by Svelte v3.46.4 */

    const file$d = "src/SVG/IconSortDateDesc.svelte";

    function create_fragment$d(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19 7H16L20 3L24 7H21V21H19V7M8 16H11V13H8V16M13 5H12V3H10V5H6V3H4V5H3C1.89 5 1 5.89 1 7V18C1 19.11 1.89 20 3 20H13C14.11 20 15 19.11 15 18V7C15 5.89 14.11 5 13 5M3 18L3 11H13L13 18L3 18Z");
    			add_location(path, file$d, 12, 4, 364);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$d, 5, 0, 152);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortDateDesc",
    			options,
    			id: create_fragment$d.name
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

    /* src/SVG/IconSortSizeAsc.svelte generated by Svelte v3.46.4 */

    const file$c = "src/SVG/IconSortSizeAsc.svelte";

    function create_fragment$c(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19 17H22L18 21L14 17H17V3H19M2 17H12V19H2M6 5V7H2V5M2 11H9V13H2V11Z");
    			add_location(path, file$c, 12, 4, 354);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$c, 5, 0, 142);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortSizeAsc",
    			options,
    			id: create_fragment$c.name
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

    /* src/SVG/IconSortSizeDesc.svelte generated by Svelte v3.46.4 */

    const file$b = "src/SVG/IconSortSizeDesc.svelte";

    function create_fragment$b(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19 7H22L18 3L14 7H17V21H19M2 17H12V19H2M6 5V7H2V5M2 11H9V13H2V11Z");
    			add_location(path, file$b, 12, 4, 355);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$b, 5, 0, 143);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSortSizeDesc",
    			options,
    			id: create_fragment$b.name
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

    /* src/SVG/IconPaste.svelte generated by Svelte v3.46.4 */

    const file$a = "src/SVG/IconPaste.svelte";

    function create_fragment$a(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z");
    			add_location(path, file$a, 12, 4, 353);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$a, 5, 0, 141);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconPaste",
    			options,
    			id: create_fragment$a.name
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

    /* src/SVG/IconUnpaste.svelte generated by Svelte v3.46.4 */

    const file$9 = "src/SVG/IconUnpaste.svelte";

    function create_fragment$9(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M3.27,1L2,2.27L6.22,6.5L3,9L4.63,10.27L12,16L14.1,14.37L15.53,15.8L12,18.54L4.63,12.81L3,14.07L12,21.07L16.95,17.22L20.73,21L22,19.73L3.27,1M19.36,10.27L21,9L12,2L9.09,4.27L16.96,12.15L19.36,10.27M19.81,15L21,14.07L19.57,12.64L18.38,13.56L19.81,15Z");
    			add_location(path, file$9, 12, 4, 350);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$9, 5, 0, 138);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconUnpaste",
    			options,
    			id: create_fragment$9.name
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

    /* src/SVG/IconNewFolder.svelte generated by Svelte v3.46.4 */

    const file$8 = "src/SVG/IconNewFolder.svelte";

    function create_fragment$8(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M12 12H14V10H16V12H18V14H16V16H14V14H12V12M22 8V18C22 19.11 21.11 20 20 20H4C2.89 20 2 19.11 2 18V6C2 4.89 2.89 4 4 4H10L12 6H20C21.11 6 22 6.89 22 8M20 8H4V18H20V8Z");
    			add_location(path, file$8, 12, 4, 359);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$8, 5, 0, 147);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconNewFolder",
    			options,
    			id: create_fragment$8.name
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

    /* src/SVG/IconUpload.svelte generated by Svelte v3.46.4 */

    const file$7 = "src/SVG/IconUpload.svelte";

    function create_fragment$7(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04M19,18H6A4,4 0 0,1 2,14C2,11.95 3.53,10.24 5.56,10.03L6.63,9.92L7.13,8.97C8.08,7.14 9.94,6 12,6C14.62,6 16.88,7.86 17.39,10.43L17.69,11.93L19.22,12.04C20.78,12.14 22,13.45 22,15A3,3 0 0,1 19,18M8,13H10.55V16H13.45V13H16L12,9L8,13Z");
    			add_location(path, file$7, 12, 4, 360);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$7, 5, 0, 148);
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
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconUpload",
    			options,
    			id: create_fragment$7.name
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

    /* src/SVG/IconReload.svelte generated by Svelte v3.46.4 */

    const file$6 = "src/SVG/IconReload.svelte";

    function create_fragment$6(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z");
    			add_location(path, file$6, 12, 4, 346);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$6, 5, 0, 134);
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
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconReload",
    			options,
    			id: create_fragment$6.name
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

    /* src/SVG/IconShare.svelte generated by Svelte v3.46.4 */

    const file$5 = "src/SVG/IconShare.svelte";

    function create_fragment$5(ctx) {
    	let svg;
    	let path;
    	let svg_viewBox_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", /*color*/ ctx[1]);
    			attr_dev(path, "d", "M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12S8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5S19.66 2 18 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12S4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.91 18 21.91S20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08M18 4C18.55 4 19 4.45 19 5S18.55 6 18 6 17 5.55 17 5 17.45 4 18 4M6 13C5.45 13 5 12.55 5 12S5.45 11 6 11 7 11.45 7 12 6.55 13 6 13M18 20C17.45 20 17 19.55 17 19S17.45 18 18 18 19 18.45 19 19 18.55 20 18 20Z");
    			add_location(path, file$5, 12, 4, 361);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*size*/ ctx[0] + " " + /*size*/ ctx[0]);
    			add_location(svg, file$5, 5, 0, 149);
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
    		i: noop$2,
    		o: noop$2,
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { size: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconShare",
    			options,
    			id: create_fragment$5.name
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

    /* src/Snippets/Properties.svelte generated by Svelte v3.46.4 */
    const file$4 = "src/Snippets/Properties.svelte";

    function create_fragment$4(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_alt_value;
    	let img_src_value;
    	let t0;
    	let t1_value = /*item*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let div1;
    	let table;
    	let tr0;
    	let td0;
    	let t4;
    	let td1;
    	let t5_value = /*item*/ ctx[0].name + "";
    	let t5;
    	let t6;
    	let tr1;
    	let td2;
    	let t8;
    	let td3;
    	let t9_value = /*item*/ ctx[0].size + "";
    	let t9;
    	let t10;
    	let tr2;
    	let td4;
    	let t12;
    	let td5;
    	let t13_value = /*item*/ ctx[0].chDate + "";
    	let t13;
    	let t14;
    	let tr3;
    	let td6;
    	let t16;
    	let td7;
    	let t17_value = /*item*/ ctx[0].mimeType + "";
    	let t17;
    	let t18;
    	let tr4;
    	let td8;
    	let t20;
    	let td9;
    	let t21_value = /*item*/ ctx[0].owner + "";
    	let t21;
    	let t22;
    	let tr5;
    	let td10;
    	let t24;
    	let td11;
    	let t25_value = /*item*/ ctx[0].group + "";
    	let t25;
    	let t26;
    	let tr6;
    	let td12;
    	let t28;
    	let td13;
    	let t29_value = /*item*/ ctx[0].permissions + "";
    	let t29;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = text(" ");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "File name:";
    			t4 = space();
    			td1 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			td2.textContent = "Size:";
    			t8 = space();
    			td3 = element("td");
    			t9 = text(t9_value);
    			t10 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			td4.textContent = "Mod. date:";
    			t12 = space();
    			td5 = element("td");
    			t13 = text(t13_value);
    			t14 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			td6.textContent = "Type:";
    			t16 = space();
    			td7 = element("td");
    			t17 = text(t17_value);
    			t18 = space();
    			tr4 = element("tr");
    			td8 = element("td");
    			td8.textContent = "Owner:";
    			t20 = space();
    			td9 = element("td");
    			t21 = text(t21_value);
    			t22 = space();
    			tr5 = element("tr");
    			td10 = element("td");
    			td10.textContent = "Group:";
    			t24 = space();
    			td11 = element("td");
    			t25 = text(t25_value);
    			t26 = space();
    			tr6 = element("tr");
    			td12 = element("td");
    			td12.textContent = "Permissions:";
    			t28 = space();
    			td13 = element("td");
    			t29 = text(t29_value);
    			attr_dev(img, "class", "centered");
    			attr_dev(img, "alt", img_alt_value = /*item*/ ctx[0].icon);
    			if (!src_url_equal(img.src, img_src_value = "icons/48x48/" + /*item*/ ctx[0].icon + ".svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$4, 36, 8, 1392);
    			attr_dev(div0, "class", "modal-header ellipsis");
    			add_location(div0, file$4, 35, 4, 1347);
    			add_location(td0, file$4, 41, 16, 1580);
    			add_location(td1, file$4, 42, 16, 1617);
    			add_location(tr0, file$4, 40, 12, 1558);
    			add_location(td2, file$4, 45, 16, 1692);
    			add_location(td3, file$4, 46, 16, 1724);
    			add_location(tr1, file$4, 44, 12, 1670);
    			add_location(td4, file$4, 49, 16, 1799);
    			add_location(td5, file$4, 50, 16, 1836);
    			add_location(tr2, file$4, 48, 12, 1777);
    			add_location(td6, file$4, 53, 16, 1913);
    			add_location(td7, file$4, 54, 16, 1945);
    			add_location(tr3, file$4, 52, 12, 1891);
    			add_location(td8, file$4, 57, 16, 2024);
    			add_location(td9, file$4, 58, 16, 2057);
    			add_location(tr4, file$4, 56, 12, 2002);
    			add_location(td10, file$4, 61, 16, 2133);
    			add_location(td11, file$4, 62, 16, 2166);
    			add_location(tr5, file$4, 60, 12, 2111);
    			add_location(td12, file$4, 65, 16, 2242);
    			add_location(td13, file$4, 66, 16, 2281);
    			add_location(tr6, file$4, 64, 12, 2220);
    			add_location(table, file$4, 39, 8, 1537);
    			attr_dev(div1, "class", "modal-content");
    			add_location(div1, file$4, 38, 4, 1500);
    			attr_dev(div2, "class", "modal shadow-1 white rounded-3 modal-bouncing");
    			set_style(div2, "max-width", "90vh");
    			attr_dev(div2, "id", "modal-properties");
    			add_location(div2, file$4, 31, 0, 1210);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t4);
    			append_dev(tr0, td1);
    			append_dev(td1, t5);
    			append_dev(table, t6);
    			append_dev(table, tr1);
    			append_dev(tr1, td2);
    			append_dev(tr1, t8);
    			append_dev(tr1, td3);
    			append_dev(td3, t9);
    			append_dev(table, t10);
    			append_dev(table, tr2);
    			append_dev(tr2, td4);
    			append_dev(tr2, t12);
    			append_dev(tr2, td5);
    			append_dev(td5, t13);
    			append_dev(table, t14);
    			append_dev(table, tr3);
    			append_dev(tr3, td6);
    			append_dev(tr3, t16);
    			append_dev(tr3, td7);
    			append_dev(td7, t17);
    			append_dev(table, t18);
    			append_dev(table, tr4);
    			append_dev(tr4, td8);
    			append_dev(tr4, t20);
    			append_dev(tr4, td9);
    			append_dev(td9, t21);
    			append_dev(table, t22);
    			append_dev(table, tr5);
    			append_dev(tr5, td10);
    			append_dev(tr5, t24);
    			append_dev(tr5, td11);
    			append_dev(td11, t25);
    			append_dev(table, t26);
    			append_dev(table, tr6);
    			append_dev(tr6, td12);
    			append_dev(tr6, t28);
    			append_dev(tr6, td13);
    			append_dev(td13, t29);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*item*/ 1 && img_alt_value !== (img_alt_value = /*item*/ ctx[0].icon)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = "icons/48x48/" + /*item*/ ctx[0].icon + ".svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*item*/ 1 && t1_value !== (t1_value = /*item*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*item*/ 1 && t5_value !== (t5_value = /*item*/ ctx[0].name + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*item*/ 1 && t9_value !== (t9_value = /*item*/ ctx[0].size + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*item*/ 1 && t13_value !== (t13_value = /*item*/ ctx[0].chDate + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*item*/ 1 && t17_value !== (t17_value = /*item*/ ctx[0].mimeType + "")) set_data_dev(t17, t17_value);
    			if (dirty & /*item*/ 1 && t21_value !== (t21_value = /*item*/ ctx[0].owner + "")) set_data_dev(t21, t21_value);
    			if (dirty & /*item*/ 1 && t25_value !== (t25_value = /*item*/ ctx[0].group + "")) set_data_dev(t25, t25_value);
    			if (dirty & /*item*/ 1 && t29_value !== (t29_value = /*item*/ ctx[0].permissions + "")) set_data_dev(t29, t29_value);
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
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
    	validate_slots('Properties', slots, []);
    	let { item } = $$props;
    	const dispatch = createEventDispatcher();

    	onMount(() => {
    		const modal = new Modal("#modal-properties");
    		const modalQuery = document.querySelector("#modal-properties");

    		modalQuery.addEventListener("ax.modal.closed", function () {
    			destroy("#modal-properties");
    			dispatch("closePropsModal");
    		});

    		modal.open();
    	});

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Properties> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		Modal,
    		destroy,
    		item,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item];
    }

    class Properties extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Properties",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<Properties> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<Properties>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Properties>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Snippets/Sharing.svelte generated by Svelte v3.46.4 */
    const file$3 = "src/Snippets/Sharing.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (94:28) {#each config.sharing.tokens as tk}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*tk*/ ctx[15] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*tk*/ ctx[15];
    			option.value = option.__value;
    			add_location(option, file$3, 94, 32, 3610);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*config*/ 1 && t_value !== (t_value = /*tk*/ ctx[15] + "")) set_data_dev(t, t_value);

    			if (dirty & /*config*/ 1 && option_value_value !== (option_value_value = /*tk*/ ctx[15])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(94:28) {#each config.sharing.tokens as tk}",
    		ctx
    	});

    	return block;
    }

    // (107:20) {#if expires}
    function create_if_block_1$1(ctx) {
    	let div;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			attr_dev(input, "type", "date");
    			attr_dev(input, "class", "form-control rounded-1");
    			add_location(input, file$3, 108, 28, 4239);
    			attr_dev(div, "class", "form-field");
    			add_location(div, file$3, 107, 24, 4185);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*expiryDate*/ ctx[1]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[13]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*expiryDate*/ 2) {
    				set_input_value(input, /*expiryDate*/ ctx[1]);
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(107:20) {#if expires}",
    		ctx
    	});

    	return block;
    }

    // (124:8) {#if !!error}
    function create_if_block$3(ctx) {
    	let div;
    	let t;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[6]);
    			attr_dev(div, "class", "p-3 my-2 rounded-2 red light-3 text-red text-dark-4");
    			add_location(div, file$3, 124, 12, 4814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*error*/ 64) set_data_dev(t, /*error*/ ctx[6]);
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
    		source: "(124:8) {#if !!error}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div18;
    	let div0;
    	let t1;
    	let div15;
    	let form;
    	let div14;
    	let div1;
    	let t3;
    	let div12;
    	let div2;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let div3;
    	let t8;
    	let div4;
    	let t10;
    	let div5;
    	let label1;
    	let input1;
    	let t11;
    	let span0;
    	let t12;
    	let t13;
    	let div6;
    	let t15;
    	let div7;
    	let t17;
    	let div8;
    	let label2;
    	let t19;
    	let select;
    	let t20;
    	let div9;
    	let t22;
    	let div10;
    	let t24;
    	let div11;
    	let label3;
    	let input2;
    	let t25;
    	let span1;
    	let t26;
    	let t27;
    	let t28;
    	let div13;
    	let t30;
    	let div17;
    	let div16;
    	let t32;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*config*/ ctx[0].sharing.tokens;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block0 = /*expires*/ ctx[2] && create_if_block_1$1(ctx);
    	let if_block1 = !!/*error*/ ctx[6] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div18 = element("div");
    			div0 = element("div");
    			div0.textContent = "Sharing";
    			t1 = space();
    			div15 = element("div");
    			form = element("form");
    			div14 = element("div");
    			div1 = element("div");
    			div1.textContent = " ";
    			t3 = space();
    			div12 = element("div");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Password";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div3 = element("div");
    			div3.textContent = " ";
    			t8 = space();
    			div4 = element("div");
    			div4.textContent = " ";
    			t10 = space();
    			div5 = element("div");
    			label1 = element("label");
    			input1 = element("input");
    			t11 = space();
    			span0 = element("span");
    			t12 = text(" Read Only");
    			t13 = space();
    			div6 = element("div");
    			div6.textContent = " ";
    			t15 = space();
    			div7 = element("div");
    			div7.textContent = " ";
    			t17 = space();
    			div8 = element("div");
    			label2 = element("label");
    			label2.textContent = "Token";
    			t19 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t20 = space();
    			div9 = element("div");
    			div9.textContent = " ";
    			t22 = space();
    			div10 = element("div");
    			div10.textContent = " ";
    			t24 = space();
    			div11 = element("div");
    			label3 = element("label");
    			input2 = element("input");
    			t25 = space();
    			span1 = element("span");
    			t26 = text(" Expiry date");
    			t27 = space();
    			if (if_block0) if_block0.c();
    			t28 = space();
    			div13 = element("div");
    			div13.textContent = " ";
    			t30 = space();
    			div17 = element("div");
    			div16 = element("div");
    			div16.textContent = "Copy link";
    			t32 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "modal-header text-center");
    			add_location(div0, file$3, 63, 4, 2119);
    			attr_dev(div1, "class", "hide-sm-down");
    			add_location(div1, file$3, 67, 16, 2289);
    			attr_dev(label0, "for", "shPassword");
    			add_location(label0, file$3, 70, 24, 2422);
    			attr_dev(input0, "type", "password");
    			attr_dev(input0, "id", "shPassword");
    			attr_dev(input0, "class", "form-control rounded-1");
    			add_location(input0, file$3, 71, 24, 2488);
    			attr_dev(div2, "class", "form-field");
    			add_location(div2, file$3, 69, 20, 2372);
    			add_location(div3, file$3, 77, 20, 2765);
    			add_location(div4, file$3, 78, 20, 2804);
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file$3, 81, 28, 2958);
    			attr_dev(span0, "class", "form-slider");
    			add_location(span0, file$3, 82, 28, 3036);
    			attr_dev(label1, "class", "form-switch mx-auto");
    			add_location(label1, file$3, 80, 24, 2893);
    			attr_dev(div5, "class", "form-field");
    			add_location(div5, file$3, 79, 20, 2843);
    			add_location(div6, file$3, 85, 20, 3157);
    			add_location(div7, file$3, 86, 20, 3196);
    			attr_dev(label2, "for", "token");
    			add_location(label2, file$3, 88, 24, 3285);
    			attr_dev(select, "class", "form-control rounded-1");
    			attr_dev(select, "id", "token");
    			if (/*token*/ ctx[3] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[11].call(select));
    			add_location(select, file$3, 89, 24, 3343);
    			attr_dev(div8, "class", "form-field");
    			add_location(div8, file$3, 87, 20, 3235);
    			add_location(div9, file$3, 98, 20, 3753);
    			add_location(div10, file$3, 99, 20, 3792);
    			attr_dev(input2, "type", "checkbox");
    			add_location(input2, file$3, 102, 28, 3946);
    			attr_dev(span1, "class", "form-slider");
    			add_location(span1, file$3, 103, 28, 4023);
    			attr_dev(label3, "class", "form-switch mx-auto");
    			add_location(label3, file$3, 101, 24, 3881);
    			attr_dev(div11, "class", "form-field");
    			add_location(div11, file$3, 100, 20, 3831);
    			add_location(div12, file$3, 68, 16, 2345);
    			attr_dev(div13, "class", "hide-sm-down");
    			add_location(div13, file$3, 115, 16, 4526);
    			attr_dev(div14, "class", "grix xs-1 md-3");
    			add_location(div14, file$3, 66, 12, 2243);
    			add_location(form, file$3, 65, 8, 2223);
    			attr_dev(div15, "class", "modal-content container");
    			add_location(div15, file$3, 64, 4, 2176);
    			attr_dev(div16, "class", "btn btn-small rounded-1 primary mb-3");
    			add_location(div16, file$3, 120, 8, 4673);
    			attr_dev(div17, "class", "modal-footer w-100 text-center");
    			add_location(div17, file$3, 119, 4, 4619);
    			attr_dev(div18, "class", "modal shadow-1 white rounded-3");
    			attr_dev(div18, "id", "modal-share");
    			add_location(div18, file$3, 62, 0, 2052);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div18, anchor);
    			append_dev(div18, div0);
    			append_dev(div18, t1);
    			append_dev(div18, div15);
    			append_dev(div15, form);
    			append_dev(form, div14);
    			append_dev(div14, div1);
    			append_dev(div14, t3);
    			append_dev(div14, div12);
    			append_dev(div12, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t5);
    			append_dev(div2, input0);
    			set_input_value(input0, /*shPassword*/ ctx[5]);
    			append_dev(div12, t6);
    			append_dev(div12, div3);
    			append_dev(div12, t8);
    			append_dev(div12, div4);
    			append_dev(div12, t10);
    			append_dev(div12, div5);
    			append_dev(div5, label1);
    			append_dev(label1, input1);
    			input1.checked = /*readOnly*/ ctx[4];
    			append_dev(label1, t11);
    			append_dev(label1, span0);
    			append_dev(label1, t12);
    			append_dev(div12, t13);
    			append_dev(div12, div6);
    			append_dev(div12, t15);
    			append_dev(div12, div7);
    			append_dev(div12, t17);
    			append_dev(div12, div8);
    			append_dev(div8, label2);
    			append_dev(div8, t19);
    			append_dev(div8, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*token*/ ctx[3]);
    			append_dev(div12, t20);
    			append_dev(div12, div9);
    			append_dev(div12, t22);
    			append_dev(div12, div10);
    			append_dev(div12, t24);
    			append_dev(div12, div11);
    			append_dev(div11, label3);
    			append_dev(label3, input2);
    			input2.checked = /*expires*/ ctx[2];
    			append_dev(label3, t25);
    			append_dev(label3, span1);
    			append_dev(label3, t26);
    			append_dev(div12, t27);
    			if (if_block0) if_block0.m(div12, null);
    			append_dev(div14, t28);
    			append_dev(div14, div13);
    			append_dev(div18, t30);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div17, t32);
    			if (if_block1) if_block1.m(div17, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[10]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[11]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[12]),
    					listen_dev(div16, "click", /*gen*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*shPassword*/ 32 && input0.value !== /*shPassword*/ ctx[5]) {
    				set_input_value(input0, /*shPassword*/ ctx[5]);
    			}

    			if (dirty & /*readOnly*/ 16) {
    				input1.checked = /*readOnly*/ ctx[4];
    			}

    			if (dirty & /*config*/ 1) {
    				each_value = /*config*/ ctx[0].sharing.tokens;
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

    			if (dirty & /*token, config*/ 9) {
    				select_option(select, /*token*/ ctx[3]);
    			}

    			if (dirty & /*expires*/ 4) {
    				input2.checked = /*expires*/ ctx[2];
    			}

    			if (/*expires*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div12, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!!/*error*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*error*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div17, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div18);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
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
    	let shPassword;
    	let readOnly;
    	let token;
    	let expires;
    	let expiryDate;
    	let error;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sharing', slots, []);
    	let { dir } = $$props;
    	let { config } = $$props;
    	const dispatch = createEventDispatcher();

    	onMount(() => {
    		const modal = new Modal("#modal-share");
    		const modalQuery = document.querySelector("#modal-share");

    		modalQuery.addEventListener("ax.modal.closed", function () {
    			destroy("#modal-share");
    			dispatch("closeShareModal");
    		});

    		modal.open();
    	});

    	async function gen(event) {
    		if (expires && !expiryDate) {
    			$$invalidate(6, error = "Please provide an expiry date");
    			return;
    		}

    		$$invalidate(6, error = "");

    		await sweetalert2_all.fire({
    			icon: "warning",
    			text: "Not implemented in the demo site",
    			confirmButtonColor: "#0a6bb8"
    		});
    	}

    	const writable_props = ['dir', 'config'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sharing> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		shPassword = this.value;
    		$$invalidate(5, shPassword);
    	}

    	function input1_change_handler() {
    		readOnly = this.checked;
    		$$invalidate(4, readOnly);
    	}

    	function select_change_handler() {
    		token = select_value(this);
    		($$invalidate(3, token), $$invalidate(0, config));
    		$$invalidate(0, config);
    	}

    	function input2_change_handler() {
    		expires = this.checked;
    		$$invalidate(2, expires);
    	}

    	function input_input_handler() {
    		expiryDate = this.value;
    		$$invalidate(1, expiryDate);
    	}

    	$$self.$$set = $$props => {
    		if ('dir' in $$props) $$invalidate(8, dir = $$props.dir);
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		fade,
    		Modal,
    		destroy,
    		Swal: sweetalert2_all,
    		dir,
    		config,
    		dispatch,
    		gen,
    		expiryDate,
    		expires,
    		token,
    		readOnly,
    		shPassword,
    		error
    	});

    	$$self.$inject_state = $$props => {
    		if ('dir' in $$props) $$invalidate(8, dir = $$props.dir);
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    		if ('expiryDate' in $$props) $$invalidate(1, expiryDate = $$props.expiryDate);
    		if ('expires' in $$props) $$invalidate(2, expires = $$props.expires);
    		if ('token' in $$props) $$invalidate(3, token = $$props.token);
    		if ('readOnly' in $$props) $$invalidate(4, readOnly = $$props.readOnly);
    		if ('shPassword' in $$props) $$invalidate(5, shPassword = $$props.shPassword);
    		if ('error' in $$props) $$invalidate(6, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*config*/ 1) {
    			$$invalidate(3, token = config.sharing.tokens[0]);
    		}
    	};

    	$$invalidate(5, shPassword = "");
    	$$invalidate(4, readOnly = true);
    	$$invalidate(2, expires = false);
    	$$invalidate(1, expiryDate = "");
    	$$invalidate(6, error = "");

    	return [
    		config,
    		expiryDate,
    		expires,
    		token,
    		readOnly,
    		shPassword,
    		error,
    		gen,
    		dir,
    		input0_input_handler,
    		input1_change_handler,
    		select_change_handler,
    		input2_change_handler,
    		input_input_handler
    	];
    }

    class Sharing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { dir: 8, config: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sharing",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*dir*/ ctx[8] === undefined && !('dir' in props)) {
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

    /* src/FileManager/FileManager.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file$2 = "src/FileManager/FileManager.svelte";

    // (156:8) {#if !!toPaste}
    function create_if_block_12(ctx) {
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
    			props: { color: "#BBBBBB", size: 24 },
    			$$inline: true
    		});

    	iconunpaste = new IconUnpaste({
    			props: { color: "#BBBBBB", size: 24 },
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
    			add_location(div0, file$2, 156, 12, 4709);
    			attr_dev(div1, "class", "navbar-link");
    			attr_dev(div1, "title", "Abort paste");
    			add_location(div1, file$2, 159, 12, 4873);
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
    					listen_dev(div0, "click", /*doPaste*/ ctx[11], false, false, false),
    					listen_dev(div1, "click", /*unmarkToPaste*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop$2,
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
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(156:8) {#if !!toPaste}",
    		ctx
    	});

    	return block;
    }

    // (169:8) {#if !config.readOnly}
    function create_if_block_11(ctx) {
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
    			add_location(div0, file$2, 169, 12, 5209);
    			attr_dev(div1, "class", "navbar-link");
    			attr_dev(div1, "title", "Upload file(s)");
    			add_location(div1, file$2, 172, 12, 5355);
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
    					listen_dev(div0, "click", /*newFolder*/ ctx[14], false, false, false),
    					listen_dev(div1, "click", /*doUpload*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop$2,
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
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(169:8) {#if !config.readOnly}",
    		ctx
    	});

    	return block;
    }

    // (177:8) {#if config.sharing != null}
    function create_if_block_10(ctx) {
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
    			add_location(div, file$2, 177, 12, 5551);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(iconshare, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*doOpenSharingModal*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$2,
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
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(177:8) {#if config.sharing != null}",
    		ctx
    	});

    	return block;
    }

    // (191:12) {:else}
    function create_else_block_1(ctx) {
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
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(191:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (189:12) {#if mode == 'GRID'}
    function create_if_block_9(ctx) {
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
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(189:12) {#if mode == 'GRID'}",
    		ctx
    	});

    	return block;
    }

    // (211:54) 
    function create_if_block_8(ctx) {
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
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(211:54) ",
    		ctx
    	});

    	return block;
    }

    // (209:55) 
    function create_if_block_7(ctx) {
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
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(209:55) ",
    		ctx
    	});

    	return block;
    }

    // (207:52) 
    function create_if_block_6(ctx) {
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(207:52) ",
    		ctx
    	});

    	return block;
    }

    // (205:53) 
    function create_if_block_5(ctx) {
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
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(205:53) ",
    		ctx
    	});

    	return block;
    }

    // (203:48) 
    function create_if_block_4(ctx) {
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(203:48) ",
    		ctx
    	});

    	return block;
    }

    // (201:16) {#if sorter == SORTERS.ABC}
    function create_if_block_3(ctx) {
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(201:16) {#if sorter == SORTERS.ABC}",
    		ctx
    	});

    	return block;
    }

    // (270:0) {:else}
    function create_else_block$2(ctx) {
    	let list;
    	let current;

    	list = new List({
    			props: {
    				itemList: /*mule*/ ctx[3].items,
    				readOnly: /*config*/ ctx[4].readOnly
    			},
    			$$inline: true
    		});

    	list.$on("message", /*click*/ ctx[8]);
    	list.$on("toPaste", /*markToPaste*/ ctx[9]);
    	list.$on("reload", /*reload_handler_1*/ ctx[23]);
    	list.$on("openPropsModal", /*doOpenPropsModal*/ ctx[17]);

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
    			if (dirty & /*mule*/ 8) list_changes.itemList = /*mule*/ ctx[3].items;
    			if (dirty & /*config*/ 16) list_changes.readOnly = /*config*/ ctx[4].readOnly;
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
    		source: "(270:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (262:0) {#if mode == 'GRID'}
    function create_if_block_2(ctx) {
    	let grid;
    	let current;

    	grid = new Grid({
    			props: {
    				itemList: /*mule*/ ctx[3].items,
    				readOnly: /*config*/ ctx[4].readOnly
    			},
    			$$inline: true
    		});

    	grid.$on("message", /*click*/ ctx[8]);
    	grid.$on("toPaste", /*markToPaste*/ ctx[9]);
    	grid.$on("reload", /*reload_handler*/ ctx[22]);
    	grid.$on("openPropsModal", /*doOpenPropsModal*/ ctx[17]);

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
    			if (dirty & /*mule*/ 8) grid_changes.itemList = /*mule*/ ctx[3].items;
    			if (dirty & /*config*/ 16) grid_changes.readOnly = /*config*/ ctx[4].readOnly;
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
    		source: "(262:0) {#if mode == 'GRID'}",
    		ctx
    	});

    	return block;
    }

    // (282:0) {#if propForFile != null}
    function create_if_block_1(ctx) {
    	let properties;
    	let updating_item;
    	let current;

    	function properties_item_binding(value) {
    		/*properties_item_binding*/ ctx[24](value);
    	}

    	let properties_props = {};

    	if (/*propForFile*/ ctx[6] !== void 0) {
    		properties_props.item = /*propForFile*/ ctx[6];
    	}

    	properties = new Properties({ props: properties_props, $$inline: true });
    	binding_callbacks.push(() => bind(properties, 'item', properties_item_binding));
    	properties.$on("closePropsModal", /*doClosePropsModal*/ ctx[18]);

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

    			if (!updating_item && dirty & /*propForFile*/ 64) {
    				updating_item = true;
    				properties_changes.item = /*propForFile*/ ctx[6];
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(282:0) {#if propForFile != null}",
    		ctx
    	});

    	return block;
    }

    // (285:0) {#if sharingOpen}
    function create_if_block$2(ctx) {
    	let sharing;
    	let current;

    	sharing = new Sharing({
    			props: {
    				dir: /*path*/ ctx[0].join('/') + '/',
    				config: /*config*/ ctx[4]
    			},
    			$$inline: true
    		});

    	sharing.$on("closeShareModal", /*doCloseSharingModal*/ ctx[20]);

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
    			if (dirty & /*path*/ 1) sharing_changes.dir = /*path*/ ctx[0].join('/') + '/';
    			if (dirty & /*config*/ 16) sharing_changes.config = /*config*/ ctx[4];
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
    		source: "(285:0) {#if sharingOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let nav;
    	let breadcrumb;
    	let t0;
    	let div12;
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
    	let div11;
    	let div3;
    	let current_block_type_index_1;
    	let if_block4;
    	let t8;
    	let div10;
    	let div4;
    	let iconsortalphasc;
    	let t9;
    	let div5;
    	let iconsortalphdesc;
    	let t10;
    	let div6;
    	let iconsortdateasc;
    	let t11;
    	let div7;
    	let iconsortdatedesc;
    	let t12;
    	let div8;
    	let iconsortsizeasc;
    	let t13;
    	let div9;
    	let iconsortsizedesc;
    	let t14;
    	let current_block_type_index_2;
    	let if_block5;
    	let t15;
    	let div13;
    	let t17;
    	let div14;
    	let t19;
    	let div15;
    	let t21;
    	let t22;
    	let if_block7_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	breadcrumb = new Breadcrumb({
    			props: { path: /*path*/ ctx[0] },
    			$$inline: true
    		});

    	breadcrumb.$on("pathEvent", /*pathEvent_handler*/ ctx[21]);
    	let if_block0 = !!/*toPaste*/ ctx[7] && create_if_block_12(ctx);
    	let if_block1 = !/*config*/ ctx[4].readOnly && create_if_block_11(ctx);
    	let if_block2 = /*config*/ ctx[4].sharing != null && create_if_block_10(ctx);
    	iconreload = new IconReload({ props: { size: 24 }, $$inline: true });
    	const if_block_creators = [create_if_block_9, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*mode*/ ctx[2] == 'GRID') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const if_block_creators_1 = [
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7,
    		create_if_block_8
    	];

    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*sorter*/ ctx[1] == SORTERS.ABC) return 0;
    		if (/*sorter*/ ctx[1] == SORTERS.CBA) return 1;
    		if (/*sorter*/ ctx[1] == SORTERS.OldFirst) return 2;
    		if (/*sorter*/ ctx[1] == SORTERS.OldLast) return 3;
    		if (/*sorter*/ ctx[1] == SORTERS.SmallFirst) return 4;
    		if (/*sorter*/ ctx[1] == SORTERS.SmallLast) return 5;
    		return -1;
    	}

    	if (~(current_block_type_index_1 = select_block_type_1(ctx))) {
    		if_block4 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	}

    	iconsortalphasc = new IconSortAlphAsc({ props: { size: 24 }, $$inline: true });
    	iconsortalphdesc = new IconSortAlphDesc({ props: { size: 24 }, $$inline: true });
    	iconsortdateasc = new IconSortDateAsc({ props: { size: 24 }, $$inline: true });
    	iconsortdatedesc = new IconSortDateDesc({ props: { size: 24 }, $$inline: true });
    	iconsortsizeasc = new IconSortSizeAsc({ props: { size: 24 }, $$inline: true });
    	iconsortsizedesc = new IconSortSizeDesc({ props: { size: 24 }, $$inline: true });
    	const if_block_creators_2 = [create_if_block_2, create_else_block$2];
    	const if_blocks_2 = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*mode*/ ctx[2] == 'GRID') return 0;
    		return 1;
    	}

    	current_block_type_index_2 = select_block_type_2(ctx);
    	if_block5 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
    	let if_block6 = /*propForFile*/ ctx[6] != null && create_if_block_1(ctx);
    	let if_block7 = /*sharingOpen*/ ctx[5] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			create_component(breadcrumb.$$.fragment);
    			t0 = space();
    			div12 = element("div");
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
    			div11 = element("div");
    			div3 = element("div");
    			if (if_block4) if_block4.c();
    			t8 = space();
    			div10 = element("div");
    			div4 = element("div");
    			create_component(iconsortalphasc.$$.fragment);
    			t9 = space();
    			div5 = element("div");
    			create_component(iconsortalphdesc.$$.fragment);
    			t10 = space();
    			div6 = element("div");
    			create_component(iconsortdateasc.$$.fragment);
    			t11 = space();
    			div7 = element("div");
    			create_component(iconsortdatedesc.$$.fragment);
    			t12 = space();
    			div8 = element("div");
    			create_component(iconsortsizeasc.$$.fragment);
    			t13 = space();
    			div9 = element("div");
    			create_component(iconsortsizedesc.$$.fragment);
    			t14 = space();
    			if_block5.c();
    			t15 = space();
    			div13 = element("div");
    			div13.textContent = " ";
    			t17 = space();
    			div14 = element("div");
    			div14.textContent = " ";
    			t19 = space();
    			div15 = element("div");
    			div15.textContent = " ";
    			t21 = space();
    			if (if_block6) if_block6.c();
    			t22 = space();
    			if (if_block7) if_block7.c();
    			if_block7_anchor = empty();
    			add_location(div0, file$2, 167, 8, 5146);
    			attr_dev(div1, "class", "navbar-link");
    			attr_dev(div1, "title", "Reload file list");
    			add_location(div1, file$2, 184, 8, 5789);
    			attr_dev(div2, "class", "navbar-link");
    			attr_dev(div2, "title", "View mode");
    			add_location(div2, file$2, 187, 8, 5920);
    			attr_dev(div3, "class", "navbar-link");
    			attr_dev(div3, "data-target", "SortBy");
    			attr_dev(div3, "title", "Sort by");
    			set_style(div3, "height", "40px");
    			add_location(div3, file$2, 195, 12, 6218);
    			attr_dev(div4, "class", "dropdown-item");
    			attr_dev(div4, "title", "Sort alphabetically, ascending");
    			toggle_class(div4, "active", /*sorter*/ ctx[1] == SORTERS.ABC);
    			add_location(div4, file$2, 215, 16, 7152);
    			attr_dev(div5, "class", "dropdown-item");
    			attr_dev(div5, "title", "Sort alphabetically, descending");
    			toggle_class(div5, "active", /*sorter*/ ctx[1] == SORTERS.CBA);
    			add_location(div5, file$2, 222, 16, 7478);
    			attr_dev(div6, "class", "dropdown-item");
    			attr_dev(div6, "title", "Sort by date, ascending");
    			toggle_class(div6, "active", /*sorter*/ ctx[1] == SORTERS.OldFirst);
    			add_location(div6, file$2, 229, 16, 7806);
    			attr_dev(div7, "class", "dropdown-item");
    			attr_dev(div7, "title", "Sort by date, descending");
    			toggle_class(div7, "active", /*sorter*/ ctx[1] == SORTERS.OldLast);
    			add_location(div7, file$2, 236, 16, 8135);
    			attr_dev(div8, "class", "dropdown-item");
    			attr_dev(div8, "title", "Sort by size, ascending");
    			toggle_class(div8, "active", /*sorter*/ ctx[1] == SORTERS.SmallFirst);
    			add_location(div8, file$2, 243, 16, 8464);
    			attr_dev(div9, "class", "dropdown-item");
    			attr_dev(div9, "title", "Sort by size, descending");
    			toggle_class(div9, "active", /*sorter*/ ctx[1] == SORTERS.SmallLast);
    			add_location(div9, file$2, 250, 16, 8797);
    			attr_dev(div10, "class", "dropdown-content dd-cnt-fix dropdown-right white shadow-1");
    			add_location(div10, file$2, 214, 12, 7063);
    			attr_dev(div11, "class", "dropdown dd-fix");
    			attr_dev(div11, "id", "SortBy");
    			add_location(div11, file$2, 194, 8, 6163);
    			attr_dev(div12, "class", "navbar-menu ml-auto");
    			set_style(div12, "height", "40px");
    			add_location(div12, file$2, 154, 4, 4615);
    			attr_dev(nav, "class", "navbar");
    			set_style(nav, "height", "40px");
    			set_style(nav, "z-index", "65535");
    			add_location(nav, file$2, 152, 0, 4513);
    			add_location(div13, file$2, 278, 0, 9670);
    			add_location(div14, file$2, 279, 0, 9689);
    			add_location(div15, file$2, 280, 0, 9708);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			mount_component(breadcrumb, nav, null);
    			append_dev(nav, t0);
    			append_dev(nav, div12);
    			if (if_block0) if_block0.m(div12, null);
    			append_dev(div12, t1);
    			append_dev(div12, div0);
    			append_dev(div12, t3);
    			if (if_block1) if_block1.m(div12, null);
    			append_dev(div12, t4);
    			if (if_block2) if_block2.m(div12, null);
    			append_dev(div12, t5);
    			append_dev(div12, div1);
    			mount_component(iconreload, div1, null);
    			append_dev(div12, t6);
    			append_dev(div12, div2);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div12, t7);
    			append_dev(div12, div11);
    			append_dev(div11, div3);

    			if (~current_block_type_index_1) {
    				if_blocks_1[current_block_type_index_1].m(div3, null);
    			}

    			append_dev(div11, t8);
    			append_dev(div11, div10);
    			append_dev(div10, div4);
    			mount_component(iconsortalphasc, div4, null);
    			append_dev(div10, t9);
    			append_dev(div10, div5);
    			mount_component(iconsortalphdesc, div5, null);
    			append_dev(div10, t10);
    			append_dev(div10, div6);
    			mount_component(iconsortdateasc, div6, null);
    			append_dev(div10, t11);
    			append_dev(div10, div7);
    			mount_component(iconsortdatedesc, div7, null);
    			append_dev(div10, t12);
    			append_dev(div10, div8);
    			mount_component(iconsortsizeasc, div8, null);
    			append_dev(div10, t13);
    			append_dev(div10, div9);
    			mount_component(iconsortsizedesc, div9, null);
    			insert_dev(target, t14, anchor);
    			if_blocks_2[current_block_type_index_2].m(target, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div13, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, div14, anchor);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, div15, anchor);
    			insert_dev(target, t21, anchor);
    			if (if_block6) if_block6.m(target, anchor);
    			insert_dev(target, t22, anchor);
    			if (if_block7) if_block7.m(target, anchor);
    			insert_dev(target, if_block7_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*reload*/ ctx[16], false, false, false),
    					listen_dev(div2, "click", /*gridOrList*/ ctx[13], false, false, false),
    					listen_dev(div4, "click", /*resort*/ ctx[12](SORTERS.ABC), false, false, false),
    					listen_dev(div5, "click", /*resort*/ ctx[12](SORTERS.CBA), false, false, false),
    					listen_dev(div6, "click", /*resort*/ ctx[12](SORTERS.OldFirst), false, false, false),
    					listen_dev(div7, "click", /*resort*/ ctx[12](SORTERS.OldLast), false, false, false),
    					listen_dev(div8, "click", /*resort*/ ctx[12](SORTERS.SmallFirst), false, false, false),
    					listen_dev(div9, "click", /*resort*/ ctx[12](SORTERS.SmallLast), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrumb_changes = {};
    			if (dirty & /*path*/ 1) breadcrumb_changes.path = /*path*/ ctx[0];
    			breadcrumb.$set(breadcrumb_changes);

    			if (!!/*toPaste*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*toPaste*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_12(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div12, t1);
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

    					if (dirty & /*config*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_11(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div12, t4);
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

    					if (dirty & /*config*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_10(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div12, t5);
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
    				if (if_block4) {
    					group_outros();

    					transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    						if_blocks_1[previous_block_index_1] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index_1) {
    					if_block4 = if_blocks_1[current_block_type_index_1];

    					if (!if_block4) {
    						if_block4 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    						if_block4.c();
    					}

    					transition_in(if_block4, 1);
    					if_block4.m(div3, null);
    				} else {
    					if_block4 = null;
    				}
    			}

    			if (dirty & /*sorter, SORTERS*/ 2) {
    				toggle_class(div4, "active", /*sorter*/ ctx[1] == SORTERS.ABC);
    			}

    			if (dirty & /*sorter, SORTERS*/ 2) {
    				toggle_class(div5, "active", /*sorter*/ ctx[1] == SORTERS.CBA);
    			}

    			if (dirty & /*sorter, SORTERS*/ 2) {
    				toggle_class(div6, "active", /*sorter*/ ctx[1] == SORTERS.OldFirst);
    			}

    			if (dirty & /*sorter, SORTERS*/ 2) {
    				toggle_class(div7, "active", /*sorter*/ ctx[1] == SORTERS.OldLast);
    			}

    			if (dirty & /*sorter, SORTERS*/ 2) {
    				toggle_class(div8, "active", /*sorter*/ ctx[1] == SORTERS.SmallFirst);
    			}

    			if (dirty & /*sorter, SORTERS*/ 2) {
    				toggle_class(div9, "active", /*sorter*/ ctx[1] == SORTERS.SmallLast);
    			}

    			let previous_block_index_2 = current_block_type_index_2;
    			current_block_type_index_2 = select_block_type_2(ctx);

    			if (current_block_type_index_2 === previous_block_index_2) {
    				if_blocks_2[current_block_type_index_2].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_2[previous_block_index_2], 1, 1, () => {
    					if_blocks_2[previous_block_index_2] = null;
    				});

    				check_outros();
    				if_block5 = if_blocks_2[current_block_type_index_2];

    				if (!if_block5) {
    					if_block5 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
    					if_block5.c();
    				} else {
    					if_block5.p(ctx, dirty);
    				}

    				transition_in(if_block5, 1);
    				if_block5.m(t15.parentNode, t15);
    			}

    			if (/*propForFile*/ ctx[6] != null) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);

    					if (dirty & /*propForFile*/ 64) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block_1(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(t22.parentNode, t22);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}

    			if (/*sharingOpen*/ ctx[5]) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);

    					if (dirty & /*sharingOpen*/ 32) {
    						transition_in(if_block7, 1);
    					}
    				} else {
    					if_block7 = create_if_block$2(ctx);
    					if_block7.c();
    					transition_in(if_block7, 1);
    					if_block7.m(if_block7_anchor.parentNode, if_block7_anchor);
    				}
    			} else if (if_block7) {
    				group_outros();

    				transition_out(if_block7, 1, 1, () => {
    					if_block7 = null;
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
    			transition_in(iconsortalphasc.$$.fragment, local);
    			transition_in(iconsortalphdesc.$$.fragment, local);
    			transition_in(iconsortdateasc.$$.fragment, local);
    			transition_in(iconsortdatedesc.$$.fragment, local);
    			transition_in(iconsortsizeasc.$$.fragment, local);
    			transition_in(iconsortsizedesc.$$.fragment, local);
    			transition_in(if_block5);
    			transition_in(if_block6);
    			transition_in(if_block7);
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
    			transition_out(iconsortalphasc.$$.fragment, local);
    			transition_out(iconsortalphdesc.$$.fragment, local);
    			transition_out(iconsortdateasc.$$.fragment, local);
    			transition_out(iconsortdatedesc.$$.fragment, local);
    			transition_out(iconsortsizeasc.$$.fragment, local);
    			transition_out(iconsortsizedesc.$$.fragment, local);
    			transition_out(if_block5);
    			transition_out(if_block6);
    			transition_out(if_block7);
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

    			if (~current_block_type_index_1) {
    				if_blocks_1[current_block_type_index_1].d();
    			}

    			destroy_component(iconsortalphasc);
    			destroy_component(iconsortalphdesc);
    			destroy_component(iconsortdateasc);
    			destroy_component(iconsortdatedesc);
    			destroy_component(iconsortsizeasc);
    			destroy_component(iconsortsizedesc);
    			if (detaching) detach_dev(t14);
    			if_blocks_2[current_block_type_index_2].d(detaching);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div13);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(div14);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(div15);
    			if (detaching) detach_dev(t21);
    			if (if_block6) if_block6.d(detaching);
    			if (detaching) detach_dev(t22);
    			if (if_block7) if_block7.d(detaching);
    			if (detaching) detach_dev(if_block7_anchor);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileManager', slots, []);
    	let { path } = $$props;
    	let { mule } = $$props;
    	let { sorter } = $$props;
    	let { mode } = $$props;
    	let { config } = $$props;
    	const dispatch = createEventDispatcher();

    	onMount(() => {
    		resort(SORTERS.ABC)();
    		new Dropdown("#SortBy");
    	});

    	onDestroy(() => {
    		destroy("#SortBy");
    	});

    	function click(event) {
    		const file = mule.items.find(i => i.uuid == event.detail.uuid);

    		if (file.isDir) {
    			// cd
    			if (file.name == "../") $$invalidate(0, path = path.slice(0, path.length - 1)); else $$invalidate(0, path = [...path, file.name]);

    			dispatch("pathEvent", { path });
    		} else {
    			dispatch("message", event.detail);
    		}
    	}

    	function markToPaste(event) {
    		$$invalidate(7, toPaste = event.detail.file);
    		isCut = event.detail.isCut;
    	}

    	function unmarkToPaste() {
    		$$invalidate(7, toPaste = null);
    		isCut = false;
    	}

    	async function doPaste() {
    		await sweetalert2_all.fire({
    			icon: "warning",
    			text: "Not implemented in the demo site",
    			confirmButtonColor: "#0a6bb8"
    		});

    		unmarkToPaste();
    		reload();
    	}

    	function resort(_sorter) {
    		return function () {
    			$$invalidate(1, sorter = _sorter);
    		};
    	}

    	function gridOrList() {
    		$$invalidate(2, mode = mode == "GRID" ? "LIST" : "GRID");
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

    		reload();
    	}

    	async function doUpload() {
    		const { value: files } = await sweetalert2_all.fire({
    			titleText: "Select files",
    			confirmButtonColor: "#0a6bb8",
    			showCancelButton: true,
    			input: "file"
    		});

    		if (!files) return;

    		await sweetalert2_all.fire({
    			icon: "warning",
    			text: "Not implemented in the demo site",
    			confirmButtonColor: "#0a6bb8"
    		});

    		reload();
    	}

    	function reload() {
    		dispatch("reload", {});
    	}

    	function doOpenPropsModal(event) {
    		$$invalidate(6, propForFile = event.detail.file);
    	}

    	function doClosePropsModal(event) {
    		$$invalidate(6, propForFile = null);
    	}

    	function doOpenSharingModal(event) {
    		$$invalidate(5, sharingOpen = true);
    	}

    	function doCloseSharingModal(event) {
    		$$invalidate(5, sharingOpen = false);
    	}

    	const writable_props = ['path', 'mule', 'sorter', 'mode', 'config'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<FileManager> was created with unknown prop '${key}'`);
    	});

    	function pathEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function reload_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function reload_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function properties_item_binding(value) {
    		propForFile = value;
    		$$invalidate(6, propForFile);
    	}

    	$$self.$$set = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    		if ('mule' in $$props) $$invalidate(3, mule = $$props.mule);
    		if ('sorter' in $$props) $$invalidate(1, sorter = $$props.sorter);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    		if ('config' in $$props) $$invalidate(4, config = $$props.config);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		fade,
    		Dropdown,
    		destroy,
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
    		newFolder,
    		doUpload,
    		reload,
    		doOpenPropsModal,
    		doClosePropsModal,
    		doOpenSharingModal,
    		doCloseSharingModal,
    		sharingOpen,
    		propForFile,
    		isCut,
    		toPaste
    	});

    	$$self.$inject_state = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    		if ('mule' in $$props) $$invalidate(3, mule = $$props.mule);
    		if ('sorter' in $$props) $$invalidate(1, sorter = $$props.sorter);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    		if ('config' in $$props) $$invalidate(4, config = $$props.config);
    		if ('sharingOpen' in $$props) $$invalidate(5, sharingOpen = $$props.sharingOpen);
    		if ('propForFile' in $$props) $$invalidate(6, propForFile = $$props.propForFile);
    		if ('isCut' in $$props) isCut = $$props.isCut;
    		if ('toPaste' in $$props) $$invalidate(7, toPaste = $$props.toPaste);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(7, toPaste = null);
    	isCut = false;
    	$$invalidate(6, propForFile = null);
    	$$invalidate(5, sharingOpen = false);

    	return [
    		path,
    		sorter,
    		mode,
    		mule,
    		config,
    		sharingOpen,
    		propForFile,
    		toPaste,
    		click,
    		markToPaste,
    		unmarkToPaste,
    		doPaste,
    		resort,
    		gridOrList,
    		newFolder,
    		doUpload,
    		reload,
    		doOpenPropsModal,
    		doClosePropsModal,
    		doOpenSharingModal,
    		doCloseSharingModal,
    		pathEvent_handler,
    		reload_handler,
    		reload_handler_1,
    		properties_item_binding
    	];
    }

    class FileManager extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			path: 0,
    			mule: 3,
    			sorter: 1,
    			mode: 2,
    			config: 4
    		});

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

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/App.svelte";

    // (89:4) {:else}
    function create_else_block$1(ctx) {
    	let slideshow;
    	let current;

    	slideshow = new Slideshow({
    			props: {
    				files: /*mule*/ ctx[2].files,
    				fileIdx: /*slideshowIndex*/ ctx[4]
    			},
    			$$inline: true
    		});

    	slideshow.$on("message", /*closeSlideshow*/ ctx[8]);

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
    			if (dirty & /*mule*/ 4) slideshow_changes.files = /*mule*/ ctx[2].files;
    			if (dirty & /*slideshowIndex*/ 16) slideshow_changes.fileIdx = /*slideshowIndex*/ ctx[4];
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(89:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (55:4) {#if slideshowIndex < 0}
    function create_if_block$1(ctx) {
    	let nav;
    	let p;
    	let t0_value = /*config*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let filemanager;
    	let updating_mule;
    	let updating_sorter;
    	let updating_mode;
    	let t2;
    	let footer;
    	let span;
    	let a0;
    	let t4;
    	let t5_value = /*config*/ ctx[0].version + "";
    	let t5;
    	let t6;
    	let a1;
    	let t8;
    	let a2;
    	let t10;
    	let a3;
    	let t12;
    	let a4;
    	let t14;
    	let current;

    	function filemanager_mule_binding(value) {
    		/*filemanager_mule_binding*/ ctx[10](value);
    	}

    	function filemanager_sorter_binding(value) {
    		/*filemanager_sorter_binding*/ ctx[11](value);
    	}

    	function filemanager_mode_binding(value) {
    		/*filemanager_mode_binding*/ ctx[12](value);
    	}

    	let filemanager_props = {
    		path: /*path*/ ctx[1],
    		config: /*config*/ ctx[0]
    	};

    	if (/*mule*/ ctx[2] !== void 0) {
    		filemanager_props.mule = /*mule*/ ctx[2];
    	}

    	if (/*sorter*/ ctx[3] !== void 0) {
    		filemanager_props.sorter = /*sorter*/ ctx[3];
    	}

    	if (/*mode*/ ctx[5] !== void 0) {
    		filemanager_props.mode = /*mode*/ ctx[5];
    	}

    	filemanager = new FileManager({ props: filemanager_props, $$inline: true });
    	binding_callbacks.push(() => bind(filemanager, 'mule', filemanager_mule_binding));
    	binding_callbacks.push(() => bind(filemanager, 'sorter', filemanager_sorter_binding));
    	binding_callbacks.push(() => bind(filemanager, 'mode', filemanager_mode_binding));
    	filemanager.$on("pathEvent", /*chPath*/ ctx[7]);
    	filemanager.$on("message", /*openSlideshow*/ ctx[6]);
    	filemanager.$on("reload", /*reload*/ ctx[9]);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(filemanager.$$.fragment);
    			t2 = space();
    			footer = element("footer");
    			span = element("span");
    			a0 = element("a");
    			a0.textContent = "Pupcloud";
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = text(" - Made with ");
    			a1 = element("a");
    			a1.textContent = "Fiber";
    			t8 = text(", ");
    			a2 = element("a");
    			a2.textContent = "Axentix";
    			t10 = text(", ");
    			a3 = element("a");
    			a3.textContent = "Svelte";
    			t12 = text(", ");
    			a4 = element("a");
    			a4.textContent = "Go";
    			t14 = text(" and ❤️");
    			attr_dev(p, "class", "navbar-brand");
    			add_location(p, file$1, 56, 12, 1816);
    			attr_dev(nav, "class", "navbar blue dark-2");
    			add_location(nav, file$1, 55, 8, 1770);
    			attr_dev(a0, "class", "pup-a");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "href", "https://github.com/proofrock/pupcloud/");
    			add_location(a0, file$1, 70, 12, 2318);
    			attr_dev(a1, "class", "pup-a");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "href", "https://gofiber.io/");
    			add_location(a1, file$1, 74, 39, 2495);
    			attr_dev(a2, "class", "pup-a");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "href", "https://useaxentix.com/");
    			add_location(a2, file$1, 77, 56, 2623);
    			attr_dev(a3, "class", "pup-a");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "href", "https://svelte.dev/");
    			add_location(a3, file$1, 80, 62, 2757);
    			attr_dev(a4, "class", "pup-a");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "href", "https://go.dev/");
    			add_location(a4, file$1, 83, 57, 2886);
    			add_location(span, file$1, 70, 6, 2312);
    			attr_dev(footer, "class", "footer blue dark-2 font-s1 lh-1 hide-sm-down");
    			set_style(footer, "position", "fixed");
    			set_style(footer, "bottom", "0");
    			set_style(footer, "z-index", "65534");
    			add_location(footer, file$1, 67, 8, 2160);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, p);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(filemanager, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, span);
    			append_dev(span, a0);
    			append_dev(span, t4);
    			append_dev(span, t5);
    			append_dev(span, t6);
    			append_dev(span, a1);
    			append_dev(span, t8);
    			append_dev(span, a2);
    			append_dev(span, t10);
    			append_dev(span, a3);
    			append_dev(span, t12);
    			append_dev(span, a4);
    			append_dev(span, t14);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*config*/ 1) && t0_value !== (t0_value = /*config*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			const filemanager_changes = {};
    			if (dirty & /*path*/ 2) filemanager_changes.path = /*path*/ ctx[1];
    			if (dirty & /*config*/ 1) filemanager_changes.config = /*config*/ ctx[0];

    			if (!updating_mule && dirty & /*mule*/ 4) {
    				updating_mule = true;
    				filemanager_changes.mule = /*mule*/ ctx[2];
    				add_flush_callback(() => updating_mule = false);
    			}

    			if (!updating_sorter && dirty & /*sorter*/ 8) {
    				updating_sorter = true;
    				filemanager_changes.sorter = /*sorter*/ ctx[3];
    				add_flush_callback(() => updating_sorter = false);
    			}

    			if (!updating_mode && dirty & /*mode*/ 32) {
    				updating_mode = true;
    				filemanager_changes.mode = /*mode*/ ctx[5];
    				add_flush_callback(() => updating_mode = false);
    			}

    			filemanager.$set(filemanager_changes);
    			if ((!current || dirty & /*config*/ 1) && t5_value !== (t5_value = /*config*/ ctx[0].version + "")) set_data_dev(t5, t5_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filemanager.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filemanager.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (detaching) detach_dev(t1);
    			destroy_component(filemanager, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(55:4) {#if slideshowIndex < 0}",
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
    	document.title = title_value = "Pupcloud " + /*config*/ ctx[0].version;
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
    			add_location(main, file$1, 53, 0, 1724);
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
    			if ((!current || dirty & /*config*/ 1) && title_value !== (title_value = "Pupcloud " + /*config*/ ctx[0].version)) {
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

    function instance$1($$self, $$props, $$invalidate) {
    	let mule;
    	let path;
    	let slideshowIndex;
    	let sorter;
    	let mode;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { config } = $$props;

    	async function loadPath(path) {
    		$$invalidate(2, mule = Mule.fromAny(await (await fetch("/mocks/ls" + path.length + ".json")).json(), path).sort(sorter));
    	}

    	function openSlideshow(event) {
    		$$invalidate(4, slideshowIndex = mule.files.findIndex(i => i.uuid == event.detail.uuid));
    	}

    	function chPath(event) {
    		$$invalidate(1, path = event.detail.path);
    	}

    	function closeSlideshow() {
    		$$invalidate(4, slideshowIndex = -1);
    	}

    	function reload() {
    		loadPath(path);
    	}

    	const writable_props = ['config'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function filemanager_mule_binding(value) {
    		mule = value;
    		($$invalidate(2, mule), $$invalidate(3, sorter));
    	}

    	function filemanager_sorter_binding(value) {
    		sorter = value;
    		$$invalidate(3, sorter);
    	}

    	function filemanager_mode_binding(value) {
    		mode = value;
    		$$invalidate(5, mode);
    	}

    	$$self.$$set = $$props => {
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    	};

    	$$self.$capture_state = () => ({
    		Mule,
    		SORTERS,
    		Slideshow,
    		FileManager,
    		config,
    		loadPath,
    		openSlideshow,
    		chPath,
    		closeSlideshow,
    		reload,
    		path,
    		slideshowIndex,
    		mule,
    		sorter,
    		mode
    	});

    	$$self.$inject_state = $$props => {
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    		if ('path' in $$props) $$invalidate(1, path = $$props.path);
    		if ('slideshowIndex' in $$props) $$invalidate(4, slideshowIndex = $$props.slideshowIndex);
    		if ('mule' in $$props) $$invalidate(2, mule = $$props.mule);
    		if ('sorter' in $$props) $$invalidate(3, sorter = $$props.sorter);
    		if ('mode' in $$props) $$invalidate(5, mode = $$props.mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path*/ 2) {
    			{
    				loadPath(path);
    			}
    		}

    		if ($$self.$$.dirty & /*mule, sorter*/ 12) {
    			{
    				$$invalidate(2, mule = mule.sort(sorter));
    			}
    		}
    	};

    	$$invalidate(2, mule = Mule.empty());
    	$$invalidate(1, path = []);
    	$$invalidate(4, slideshowIndex = -1);
    	$$invalidate(3, sorter = SORTERS.ABC);
    	$$invalidate(5, mode = "GRID");

    	return [
    		config,
    		path,
    		mule,
    		sorter,
    		slideshowIndex,
    		mode,
    		openSlideshow,
    		chPath,
    		closeSlideshow,
    		reload,
    		filemanager_mule_binding,
    		filemanager_sorter_binding,
    		filemanager_mode_binding
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

    /* src/Auth.svelte generated by Svelte v3.46.4 */
    const file = "src/Auth.svelte";

    // (65:0) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "blanket");
    			add_location(div, file, 65, 4, 2132);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$2,
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(65:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:0) {#if config != null}
    function create_if_block(ctx) {
    	let app;
    	let current;

    	app = new App({
    			props: { config: /*config*/ ctx[0] },
    			$$inline: true
    		});

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
    		source: "(63:0) {#if config != null}",
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

    	onMount(async () => {
    		let password = null;
    		const params = new URLSearchParams(window.location.search);
    		let url = "/mocks/features.json";

    		if (params.has("x")) {
    			url += "?x=" + encodeURIComponent(params.get("x")) + "&tk=" + encodeURIComponent(params.get("tk"));
    		}

    		while (true) {
    			const res = await fetch(url, { headers: { "x-pupcloud-pwd": password } });

    			if (res.status == 200) {
    				const cfgObj = await res.json();
    				$$invalidate(0, config = Config.fromAny(cfgObj));
    				break;
    			}

    			await sweetalert2_all.fire({
    				icon: "error",
    				text: await res.text(),
    				confirmButtonColor: "#0a6bb8"
    			});

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
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Auth> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ App, Config, onMount, Swal: sweetalert2_all, config });

    	$$self.$inject_state = $$props => {
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, config = null);
    	return [config];
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
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
