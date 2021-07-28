import { Subject } from 'rxjs'
import { WatchHandler, WatchOptions } from 'vue'
import { createDecorator } from 'vue-class-component'

/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  watchOptions
 */
export function WatchToSubject(path: string, watchOptions: WatchOptions = {}) {
  return createDecorator((componentOptions, key) => {
    componentOptions.watch ||= Object.create(null)
    const watch: any = componentOptions.watch
    if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
      watch[path] = [watch[path]]
    } else if (typeof watch[path] === 'undefined') {
      watch[path] = []
    }

    const handler = function(this: any, args: any) {
      const decoratedProp = this[key]

      if (! (decoratedProp instanceof Subject))
        throw Error('Can only publish changes to a Subject')

      const subject: Subject<unknown> = decoratedProp
      subject.next(args)
    }

    watch[path].push({ handler, ...watchOptions })
  })
}