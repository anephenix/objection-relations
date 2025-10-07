// Dependencies
import type { ModelType, OptionsProps } from "./global.js";
import { relation } from "./relations.js";

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

	belongsTo(object: ModelType, options?: OptionsProps) {
		if (!options) options = { modelPath: this.modelPath };
		if (!options.modelPath) options.modelPath = this.modelPath;
		return relation({
			subject: this.subject,
			relType: "belongsTo",
			object,
			options,
		});
	}

	hasOne(object: ModelType, options?: OptionsProps) {
		if (!options) options = { modelPath: this.modelPath };
		if (!options.modelPath) options.modelPath = this.modelPath;
		return relation({
			subject: this.subject,
			relType: "hasOne",
			object,
			options,
		});
	}

	hasMany(object: ModelType, options?: OptionsProps) {
		if (!options) options = { modelPath: this.modelPath };
		if (!options.modelPath) options.modelPath = this.modelPath;
		return relation({
			subject: this.subject,
			relType: "hasMany",
			object,
			options,
		});
	}

	hasManyThrough(object: ModelType, via: string, options?: OptionsProps) {
		if (!options) options = { modelPath: this.modelPath };
		if (!options.modelPath) options.modelPath = this.modelPath;
		return relation({
			subject: this.subject,
			relType: "hasManyThrough",
			object,
			via,
			options,
		});
	}
}
