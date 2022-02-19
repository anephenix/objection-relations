// Dependencies
import { OptionsProps } from './global';
import { relation } from './relations';

// Types

type ObjectionRelationProps = {
  subject: string;
  modelPath: string;
};

export class ObjectionRelation {
  subject: string;
  modelPath: string;
  constructor({ subject, modelPath }: ObjectionRelationProps) {
    this.subject = subject;
    this.modelPath = modelPath;
  }

  belongsTo(object: string, options?: OptionsProps) {
    if (!options) options = { modelPath: this.modelPath };
    if (!options.modelPath) options.modelPath = this.modelPath;
    return relation({
      subject: this.subject,
      relType: 'belongsTo',
      object,
      options,
    });
  }

  hasOne(object: string, options?: OptionsProps) {
    if (!options) options = { modelPath: this.modelPath };
    if (!options.modelPath) options.modelPath = this.modelPath;
    return relation({
      subject: this.subject,
      relType: 'hasOne',
      object,
      options,
    });
  }

  hasMany(object: string, options?: OptionsProps) {
    if (!options) options = { modelPath: this.modelPath };
    if (!options.modelPath) options.modelPath = this.modelPath;
    return relation({
      subject: this.subject,
      relType: 'hasMany',
      object,
      options,
    });
  }

  hasManyThrough(object: string, via: string, options?: OptionsProps) {
    if (!options) options = { modelPath: this.modelPath };
    if (!options.modelPath) options.modelPath = this.modelPath;
    return relation({
      subject: this.subject,
      relType: 'hasManyThrough',
      object,
      via,
      options,
    });
  }
}
