/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/sort-comp */
import React, { Component, createRef, RefObject } from "react";
import TuiImageEditor from "tui-image-editor";

interface ImageEditorProps {
  [key: string]: any;
}
interface TuiImageEditorType extends TuiImageEditor {
  off(eventName: string): void;
}
export default class ImageEditor extends Component<ImageEditorProps> {
  rootEl: RefObject<HTMLDivElement>;

  imageEditorInst: TuiImageEditorType | null = null;

  constructor(props: ImageEditorProps) {
    super(props);
    this.rootEl = createRef<HTMLDivElement>();
  }

  componentDidMount() {
    if (this.rootEl.current) {
      this.imageEditorInst = new TuiImageEditor(this.rootEl.current, {
        ...this.props,
      }) as TuiImageEditorType;
      this.bindEventHandlers(this.props);
    }
  }

  componentWillUnmount() {
    if (this.imageEditorInst) {
      this.unbindEventHandlers();
      this.imageEditorInst.destroy();
      this.imageEditorInst = null;
    }
  }

  shouldComponentUpdate(nextProps: ImageEditorProps) {
    this.bindEventHandlers(nextProps, this.props);
    return false;
  }

  getInstance() {
    return this.imageEditorInst;
  }

  getRootElement() {
    return this.rootEl.current;
  }

  bindEventHandlers(props: ImageEditorProps, prevProps?: ImageEditorProps) {
    if (!this.imageEditorInst) return;

    Object.keys(props)
      .filter(this.isEventHandlerKey)
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);
        if (prevProps && prevProps[key] !== props[key]) {
          this.imageEditorInst!.off(eventName);
        }
        this.imageEditorInst!.on(eventName, props[key]);
      });
  }

  unbindEventHandlers() {
    if (!this.imageEditorInst) return;

    Object.keys(this.props)
      .filter(this.isEventHandlerKey)
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);
        this.imageEditorInst!.off(eventName);
      });
  }

  // eslint-disable-next-line class-methods-use-this
  isEventHandlerKey(key: string) {
    return /on[A-Z][a-zA-Z]+/.test(key);
  }

  render() {
    return <div ref={this.rootEl} />;
  }
}
