/**
 * This file was auto-generated by swagger-to-ts.
 * Do not make direct changes to the file.
 */

/**
 * Contains properties common to all Configuration API request bodies.
 */
export type CommonRequest = {
  /**
   * Language used to translate texts.
   */
  language?: string;
  /**
   * Currency used during pricing.
   */
  currency?: string;
  /**
   * Date used in SAP pricing. Supports the ISO 8601 date time format.
   */
  date?: string;
  /**
   * For configurations with sublines, put any arguments that are common
   * to all lines here. For example, the sales area.
   */
  globalArguments?: { [key: string]: { [key: string]: any } };
  /**
   * ID of the price procedure to use during pricing. If null, a default
   * price procedure is resolved from the price definition.
   */
  priceProcedureId?: string;
  line?: Line;
  settings?: Settings;
};
export type ConfigurationValue = ValueState & {
  /**
   * The value type.
   */
  type?: 'IntervalValue' | 'SingletonValue';
  excluded?: ValueState;
};
/**
 * Represents a variable in the configuration.
 */
export type ConfigurationVariable = {
  /**
   * The ID of the variable.
   */
  id?: string;
  /**
   * The text to display, representing the variable's name. The text is
   * translated based on the language in the request.
   */
  name?: string;
  /**
   * Type of the `values`.
   */
  valueType?: string;
  /**
   * Number of distinct `values`.
   */
  distinctValueCount?: number;
  /**
   * Indicates whether multiple values can be assigned to the variable
   * simultaneously.
   */
  allowMultipleAssignments?: boolean;
  /**
   * The values that can be assigned to this variable.
   */
  values?: ConfigurationValue[];
  /**
   * Properties that provide additional information about the variable.
   *
   * One way to use properties is to pass information to your application
   * that the variable needs special treatment in the UI. For example, a
   * "Required" property for drawing the user's attention to the variable
   * in the configurator, or a "Show" property indicating whether or not
   * to show the variable in the UI.
   */
  properties?: Property[];
  /**
   * Configurator issues related to the variable. If one of
   * its assigned values is involved in a conflict, `issues` provides
   * information about how to fix the value.
   */
  issues?: Issue[];
};
export type ConfigureRequest = CommonRequest & { [key: string]: any } & {
  /**
   * The ID of the view to use. Views determine how variables are
   * organized in sections in the response.
   */
  viewId?: string;
  /**
   * Line for which the configuration state is requested. Only
   * relevant for multi-level products.
   */
  currentLineId?: string;
};
/**
 * Response object returned by `/configure`.
 *
 * The response has the configuration of the product, and includes the
 * variables, their values, pricing information, and arguments.
 *
 * The variables are organized into sections based on the requested view.
 * Sections provide the structure for how to show variables in the UI. For
 * instance, you might display sections as sheets in a tabbed control.
 *
 * Each variable has a collection of values that represent the variable's
 * domain.
 *
 * Values have a state that says how the user can interact with the value.
 * For example, if the user can assign it or not, and what consequences may
 * occur when assigning.
 */
export type ConfigureResponse = {
  /**
   * Collection of phases when the underlying product model supports phased configuration.
   */
  phases?: Phase[];
  /**
   * Provides information on completion of the phases.
   */
  phaseCompletion?: {
    /**
     * Indicates the number of phases that have been completed.
     */
    completedPhases?: number;
    /**
     * Indicates whether the phases have been completed (`true`) or if there
     * are still incomplete phases (`false`).
     */
    isComplete?: boolean;
    /**
     * Indicates the total number of phases in the configuration.
     */
    totalPhases?: number;
  };
  /**
   * Collection of sections based on the `viewId` in the request.
   */
  sections?: Section[];
  /**
   * Issues, if any, found while processing the assignments.
   */
  issues?: Issue[];
  priceSheet?: PriceSheet;
  removedAssignments?: RemovedAssignments;
  /**
   * Contains the original request arguments, plus any added by the
   * operation (for example, variants used by the price service).
   */
  arguments?: { [key: string]: any };
  /**
   * Indicates whether all variables in the configuration have an
   * assignment.
   */
  isComplete?: boolean;
  /**
   * Indicates whether the product is configurable (`true`) or is a
   * standard, non-configurable product (`false`).
   */
  isConfigurable?: boolean;
  debug?: Debug;
  /**
   * The language in which `name`s are translated into (for variables,
   * values, sections, and price lines).
   *
   * If requested language was not found, the resolved language is empty.
   * Names are replaced with IDs.
   */
  language?: string;
  /**
   * The `packagePath` from the request, or the latest versioned path of
   * the package if no version was specified. Subsequent API requests
   * during the same configuration session should use the versioned
   * package path.
   */
  packagePath?: string;
};
/**
 * Debug information.
 */
export type Debug = {
  priceTrace?: Trace;
  /**
   * For details on how values are assigned in the configuration.
   */
  solveTrace?: string;
  sublinesTrace?: Trace;
};
export type ErrorResponse = {
  /**
   * The type of error that occurred.
   */
  type?:
    | 'MalformedRequest'
    | 'PackageNotFound'
    | 'CannotLoadPackage'
    | 'MissingProperty'
    | 'NoOrganizationInPackagePath'
    | 'InternalServerError';
  /**
   * A user-friendly description of the error.
   */
  message?: string;
};
/**
 * A variable value that has a lower and upper bounds.
 */
export type IntervalValue = ConfigurationValue & {
  /**
   * Lower bound of the interval.
   */
  lower?: string | number;
  /**
   * Upper bound of the interval.
   */
  upper?: string | number;
};
/**
 * Represents an issue that occurred during the operation.
 */
export type Issue = {
  /**
   * The issue type.
   */
  type?: string;
  /**
   * An internal message describing the issue.
   */
  message?: string;
  /**
   * Collection of sources that caused the issue. For example, the
   * constraint(s) that could not be met.
   */
  sources?: string[];
  /**
   * Collection of variables affected by the issue, if any. Assigning
   * different values to the variables may help fix the issue.
   */
  affectedVariables?: string[];
};
/**
 * The main line describing the product being configured or priced. For
 * multi-level products, it represents the root line.
 *
 * As part of a request, it holds all the assignments in context of single
 * product and assignments of 'root' product in multi-level configurations.
 */
export type Line = {
  /**
   * ID of the line's product. Required in requests.
   */
  productId?: string;
  /**
   * Assignments to the configurator for the line.
   */
  variableAssignments?: VariableAssignment[];
  /**
   * Assignments to the price calculation for the line.
   */
  priceLineAssignments?: PriceLineAssignment[];
  /**
   * Arguments that apply to the line being configured/priced. For
   * multi-level configurations, put any arguments common to all lines
   * (such as the sales area) in `globalArguments`.
   */
  arguments?: { [key: string]: { [key: string]: any } };
  product?: Product;
  quantity?: ValueWithUnit;
  priceSheet?: PriceSheet;
  /**
   * Provides a hash based on the configuration state of the line as it
   * would be obtained by calling the configure endpoint. Provided in
   * responses.
   */
  stateHash?: string;
  /**
   * Indicates whether all variables in the line have an assignment.
   */
  isComplete?: boolean;
  /**
   * > Applies to the main line only (sublines cannot have sublines).
   *
   * Represents the sublines of the main line, if any.
   *
   * This is a flat list of nested lines. For any line containing a
   * multi-level product, its sublines will be included in the list as
   * well, and so on.
   *
   * A subline's `parentId` indicates which line it belongs to.
   *
   * Only pass user assignments to sublines that have either variable
   * assignments or price line assignments.
   */
  sublines?: Subline[];
};
/**
 * A line within a price sheet.
 *
 * Some lines contribute to the total value of the price sheet, while
 * others are for informational purposes, like subtotals, statistical
 * values, or header lines.
 *
 * For non-header lines, the PriceLineRate represents the value used to
 * calculate the price line result.
 *
 * If `rate.isAssignable` is `true`, you can set the price
 * line's value in price line assignments in requests.
 *
 * See `status` to determine whether the price line contributes to the
 * price, and if the line is invalid.
 */
export type PriceLine = {
  /**
   * The ID of the price line. Used in a price line assignment to
   * reference a price line.
   */
  id?: string;
  /**
   * The ID of the price procedure step that generated the price line.
   */
  stepId?: string;
  /**
   * A name describing the price line. The text is translated based on
   * the language in the request.
   */
  name?: string;
  /**
   * Optionally contains the feature that caused this price line to be
   * added.
   */
  feature?: string;
  rate?: PriceLineRate;
  result?: ValueWithUnit;
  status?: PriceLineStatus;
  /**
   * Additional properties for this price line, if any.
   */
  properties?: Property[];
};
/**
 * Represents a value assignment to a price line.
 *
 * Depending on the step that generated the price line, the assignment
 * must specify the price line to assign to in different ways:
 *
 * - If the step always generates a single price line, then set `stepId`.
 * - If the step is a feature step (such as an SAP variant condition) that
 *   can generate more than one price line, set both `stepId` and
 *   `feature`.
 * - If the step is not a feature step, and can generate more than one
 *   price line, set the `priceLineId`. Note: Because the price line IDs
 *   are not guaranteed to be stable, it is considered bad practice to
 *   rely on the `priceLineId` for assignments.
 *
 * To get the values for `stepId`, `feature`, and `priceLineId`, see their
 * equivalent properties on the price line.
 *
 * The assignment is evaluated in the following order:
 *
 * - If `priceLineId` is set, and a price line with that ID exists, the
 *   assignment is applied.
 * - If `stepId` and `feature` are set, and exactly one price line exists
 *   under those conditions, the assignment is applied.
 * - If `stepId` is set, and exactly one price line exists for that step,
 *   the assignment is applied.
 *
 * If none of the above conditions are met, the assignment is removed and
 * added to `removedAssignments`.
 */
export type PriceLineAssignment = {
  /**
   * Step ID of the price line to assign `rateValue` to. If the price
   * line's `feature` is set, assign it to the price line assignment's
   * `feature` property as well.
   */
  stepId?: string;
  /**
   * The feature of the price line to assign `rateValue` to. For use in
   * combination with `stepId`.
   */
  feature?: string;
  /**
   * Identifier of the price line to assign `rateValue` to. Only set this
   * property when the price line cannot be identified by `stepId` and
   * `feature`.
   */
  priceLineId?: string;
  /**
   * The value to assign to the price line rate.
   */
  rateValue?: number;
};
/**
 * The rate, consisting of a value, its unit of measurement, and (where
 * relevant) batch size. Used for calculating the `result` in a price line.
 */
export type PriceLineRate = {
  /**
   * Indicates whether the price line can be assigned in a
   * price line assignment (`true`) or is read-only (`false`).
   */
  isAssignable?: boolean;
  /**
   * Indicates whether the price line was assigned in a price line
   * assignment (`true`) or not (`false`).
   */
  isAssigned?: boolean;
  batchSize?: ValueWithUnit;
  /**
   * Determines if the `value` is constrained to a sign.
   *
   * Possible values:
   * - `Positive`: Value must be greater than or equal to zero.
   * - `Negative`: Value must be less than or equal to zero.
   * - `None`: Value can be either positive or negative.
   */
  signConstraint?: 'Positive' | 'Negative' | 'None';
  /**
   * The value. See `unit` for the value's unit of measurement.
   */
  value?: number;
  /**
   * Unit of measurement of the `value`.
   */
  unit?: string;
  /**
   * Lowest possible value that `value` can be.
   */
  lowerLimit?: number;
  /**
   * Highest possible value that `value` can be.
   */
  upperLimit?: number;
};
/**
 * Explains if a price line is disabled, invalid, or is for informational
 * purposes. In these cases, the price line does not contribute to
 * the price.
 */
export type PriceLineStatus = {
  /**
   * Indicates whether the price line is for purely informational
   * purposes, such as a subtotal or statistical value. Informational
   * prices lines do not contribute to pricing.
   */
  isInformational?: boolean;
  /**
   * Indicates whether the price line is disabled or not. Price lines
   * can become disabled by the pricing procedure.
   *
   * Disabled price lines do not contribute to pricing.
   */
  isDisabled?: boolean;
  /**
   * Explains why the price line is disabled.
   */
  disabledReasons?: string[];
  /**
   * Indicates whether the price line is invalid or not. This can happen,
   * for example, due to a division by zero error or a mismatch in
   * units.
   *
   * Invalid price lines do not contribute to pricing.
   */
  isInvalid?: boolean;
  /**
   * Explains why the price line is invalid.
   */
  invalidReasons?: string[];
};
export type PriceRequest = CommonRequest & { [key: string]: any } & {
  /**
   * > For multi-level products only.
   *
   * ID of the line to price.
   */
  currentLineId?: string;
};
/**
 * Response object returned by `/price`.
 *
 * The response includes a pricing sheet with price lines and totals,
 * the arguments used, and (optionally) debug information.
 */
export type PriceResponse = {
  priceSheet?: PriceSheet;
  /**
   * A collection of issues found while processing the assignments, which
   * may prevent computing the price sheet.
   */
  issues?: Issue[];
  removedAssignments?: RemovedAssignments;
  /**
   * Contains the original request arguments, plus any added by the
   * service (for example, variants).
   */
  arguments?: { [key: string]: any };
  debug?: Debug;
  /**
   * The language in which `PriceLine.name`, `RemovedVariable.name` and
   * `RemovedValue.name` are translated into.
   *
   * If requested language was not found, resolved language is empty.
   * Names are replaced with IDs.
   */
  language?: string;
  /**
   * The `packagePath` from the request, or the latest versioned path of
   * the package if no version was specified. Subsequent API requests
   * during the same configuration session should use the versioned
   * package path.
   */
  packagePath?: string;
};
/**
 * Contains the price lines and pricing summary (net value, taxes, and total price) for a product.
 */
export type PriceSheet = {
  /**
   * The internal ID.
   */
  id?: string;
  totals?: PriceSummary;
  /**
   * The price lines comprising the sheet. When `onlyPriceTotals` is
   * `true`, price lines are not provided.
   */
  priceLines?: PriceLine[];
  /**
   * Indicates whether any of the price lines are invalid. This can
   * happen, for example, due to a mismatch of units, or a division by
   * zero error.
   */
  isInvalid?: boolean;
};
/**
 * The summary of a `PriceSheet`, including the product's net value, tax, and total price (net value minus tax).
 */
export type PriceSummary = {
  tax?: ValueWithCurrency;
  net?: ValueWithCurrency;
  total?: ValueWithCurrency;
};
/**
 * A product associated with a line or subline.
 */
export type Product = {
  /**
   * The product ID.
   */
  id?: string;
  /**
   * The translated text of the product.
   */
  name?: string;
  /**
   * Indicates whether the product is configurable (`true`) or is a
   * standard, non-configurable product (`false`).
   */
  isConfigurable?: boolean;
};
export type ProductDetails = {
  /**
   * ID of the product.
   */
  id?: string;
  /**
   * The translated product name.
   */
  name?: string;
  /**
   * The translated description of the product.
   */
  description?: string;
  /**
   * The quantity unit of the product (EA, KG, MM, etc.).
   */
  unit?: string;
  /**
   * Indicates whether the product is configurable (`true`) or is a
   * standard, non-configurable product (`false`).
   */
  isConfigurable?: boolean;
  /**
   * The custom product properties defined in the package.
   */
  properties?: Property[];
};
export type ProductsResponse = {
  products?: ProductDetails[];
  /**
   * Total number of products that matched the search term.
   *
   * The actual number of returned results depends on `limit` and
   * `offset` in the request.
   */
  total?: number;
  /**
   * The language in which `ProductDetails.name`,
   * `ProductDetails.description` and `Property.name` are translated
   * into.
   *
   * If requested language was not found, resolved language is empty.
   * Names are replaced with IDs and descriptions are empty.
   */
  language?: string;
  /**
   * The `packagePath` from the request, or the latest versioned path of
   * the package if no version was specified. Subsequent API requests
   * during the same configuration session should use the versioned
   * package path.
   */
  packagePath?: string;
};
/**
 * A property provides additional information that can be associated with
 * Section, ConfigurationVariable, SingleValuedValue.
 */
export type Property = {
  /**
   * ID of the property.
   */
  id?: string;
  /**
   * > For single-valued properties only.
   *
   * The property value. For example, 'true', 42, or 'This is a
   * description'.
   */
  value?: { [key: string]: any };
  /**
   * > For properties with multiple values only.
   *
   * The property values. For example {'France', 'Denmark'}.
   */
  values?: { [key: string]: any }[];
  /**
   * The property type, which can be:
   *
   * - `String`: For example, `LongDescription="This a description"`.
   * - `Number`: For example, `Weight=42.0`.
   * - `Date`: Supports the ISO 8601 date time format. For example,
   *   `Expires=2020-05-03`.
   * - `Uri`: For example, `Image="http://placehold.it/350x150"`.
   * - `Boolean`: For example, `Show=false`.
   */
  type?: 'String' | 'Number' | 'Date' | 'Uri' | 'Boolean';
};
/**
 * Variable and/or price line assignments that were removed from a
 * configure and/or price request.
 */
export type RemovedAssignments = {
  /**
   * A collection of assignments removed during the configuration solve.
   *
   * An assignment is removed when:
   *
   * - Other assignments are made with values that are incompatible.
   * - Multiple assignments are made to the same variable, and the
   *   variable does not allow multiple assignments
   *   (`allowMultipleAssignments`) is `false`). In this case, the last
   *   assignment is preserved, and all others are removed.
   *
   * For SAP products, assignments with values that are `incompatible`
   * are not added to `removedAssignments`.
   */
  variableAssignments?: RemovedAssignment[];
  /**
   * A collection of assignments removed by the price service.
   *
   * Assignments are removed when they have been made to non-existing
   * price lines. This can happen to assignments to price lines of
   * variant that was removed during configuration.
   *
   * Clients should use these values to update their state.
   */
  priceLineAssignments?: PriceLineAssignment[];
};
/**
 * Represents a removed value assignment to a variable.
 */
export type RemovedAssignment = {
  variable?: RemovedVariable;
  value?: RemovedValue;
};
/**
 * Represents a variable in a `removedAssignment`.
 */
export type RemovedVariable = {
  /**
   * The ID of the variable for which the assignment was removed.
   */
  id?: string;
  /**
   * The value that was removed.
   */
  name?: string;
  /**
   * The type of the values for the variable that was removed.
   */
  valueType?: string;
  /**
   * Indicates whether multiple values can be assigned to the variable
   * simultaneously.
   */
  allowMultipleAssignments?: boolean;
};
/**
 * Represents a removed value assignment to a variable.
 */
export type RemovedValue = {
  /**
   * The value that was removed.
   */
  value?: string | number;
  /**
   * The text to display, representing name of the value. The text is
   * translated based on the language in the request.
   */
  name?: string;
  /**
   * > For multi-value variables only.
   *
   * Indicates whether the `value` should be excluded.
   */
  exclude?: boolean;
};
/**
 * A section represents a grouping of variables. Sections are defined in
 * views.
 *
 * Sections provide the structure for how to present the variables
 * visually. For instance, each section could be displayed as a sheet in a
 * tabbed control. A section may contain subsections.
 */
export type Section = {
  /**
   * The ID of the section.
   */
  id?: string;
  /**
   * The text to display, representing the section's name. The text is
   * translated based on the language in the request.
   */
  name?: string;
  /**
   * The section's subsections, if any.
   */
  sections?: Section[];
  /**
   * The collection of ConfigurationVariable objects belonging to this
   * section.
   */
  variables?: ConfigurationVariable[];
  /**
   * Miscellaneous properties.
   */
  properties?: Property[];
};
export type Phase = {
  /**
   * Indicates whether the phase has been completed.
   */
  isComplete?: boolean;
  /**
   * The sections of the phase.
   */
  sections?: Section[];
};
/**
 * Settings for changing the behavior of `/configure`, `/price`, and
 * `/sublines`, including what is returned in the responses.
 *
 * All settings are `false` by default.
 */
export type Settings = {
  /**
   * Indicates whether the response includes debugging information.
   */
  debug?: boolean;
  /**
   * Indicates whether the response includes the state/justification from
   * the underlying solve service. They detail `ValueState.assigned` and
   * `ValueState.incompatible`.
   */
  includeStateAndJustification?: boolean;
  /**
   * Indicates whether the response includes all values, even
   * those that are unavailable due to rules or phase assignments.
   *
   * In order to make clear distinction between all possible value
   * states, this flag (when `true`) triggers the flag
   * `Settings.includeStateAndJustification`.
   */
  includeAllValues?: boolean;
  /**
   * > Unsupported by SAP products.
   *
   * The order that assignments are applied during configuration solves.
   *
   * The possible values are:
   *
   * - `LastThenFirst`:
   *   The last assignment has the highest priority. The others have the
   *   priorities in the reverse order of assignments: the first
   *   assignment has priority over the second, the second over the third
   *   and so on.
   * - `LastThenRemoveFewest`:
   *   The last assignment has the highest priority and the others have
   *   the same. Use this behavior to have the minimum number of removed
   *   assignments.
   * - `LastToFirst`:
   *   Each assignment has the priority corresponding to its order. First
   *   has lowest priority, last the highest. Use this behavior to
   *   prioritize latest assignments over oldest.
   * - `ByPriority`:
   *   Each assignment has the priority given by the variable assignment.
   *   Use this behavior to directly handle priority.
   */
  assignmentResolutionOrder?:
    | 'LastThenFirst'
    | 'LastThenRemoveFewest'
    | 'LastToFirst'
    | 'ByPriority';
  /**
   * Indicates whether the response includes price lines in the
   * price sheet. For debugging purposes.
   *
   * > This flag is ignored by `/price`.
   */
  includePriceLines?: boolean;
  /**
   * > For `/price` only.
   *
   * Indicates whether the response should exclude `priceLines` from the
   * price sheet.
   */
  onlyPriceTotals?: boolean;
  /**
   * > For /configure only.
   *
   * The IDs of the sections to include in the responses.
   *
   * Subsections can be referenced by joining their IDs with IDs of their
   * parents, separated by a dot '.'. For example,
   * 'MainSection.SubSection.SubSubSection'.
   *
   * If this property is provided and is not empty, any sections that do
   * not match these IDs is not provided.
   */
  includeSections?: string[];
  /**
   * > For /configure only.
   *
   * The IDs of the properties to include in the response. This also
   * includes translation IDs.
   *
   * If this property is not provided or is empty, all available
   * properties and translations are included.
   */
  includeProperties?: string[];
  /**
   * > For /configure only.
   *
   * Controls the behavior of a phased configuration.
   *
   * The possible values are:
   *
   * - `Default`:
   * If the underlying product model contains phases, phases must be
   * completed before following phases and unphased sections are returned.
   * Variables that are not part of the current phase cannot be assigned.
   * - `IncludeAllVariables`:
   * Like default, but all phases and unphased sections are returned.
   * - `InSections`:
   * Do not enforce a phased configuration, but return the phases as sections.
   * Note that this mode can give surprising results if you change a phase after
   * starting the configuration of sections.
   */
  phaseBehavior?: 'Default' | 'IncludeAllVariables' | 'InSections';
};
/**
 * Represents a single value, such as string, number, or date (ISO 8601
 * date time format).
 *
 * If the value is in a variable where `allowMultipleAssignments` is
 * `true`, then:
 *
 * - To **include** a value in a configuration:
 *   - Create a `VariableAssignment`.
 *   - Set the assignment's `VariableAssignment.value` to the value.
 *
 * - To **exclude** a value from a configuration:
 *   - Create a `VariableAssignment`.
 *   - Set the assignment's `VariableAssignment.value` to the  value.
 *   - Set the assignment's `VariableAssignment.exclude` property to `true`.
 *
 * In addition to `ConfigurationValue` info `MultiValuedValue` also have
 * `MultiValuedValue.exclude`.
 */
export type SingletonValue = ConfigurationValue & {
  /**
   * A textual representation of the value. For non-numeric values,
   * the text is translated based on the language in the request.
   */
  name?: string;
  /**
   * The value, which may be a string, number, or date. For example,
   * "RED", 42, 2020-05-03.
   */
  value?: string | number;
  /**
   * Properties providing additional information about the value.
   */
  properties?: Property[];
};
export type Subline = Line & {
  /**
   * ID of the subline.
   */
  id?: string;
  /**
   * Parent of subline, as provided by `/sublines`. In requests, it
   * is optional and can be used for debugging purposes.
   */
  parentId?: string;
};
export type SublinesRequest = CommonRequest & { [key: string]: any };
/**
 * Response object returned by `/sublines`.
 *
 * Contains a root line and a flattened list of any sublines that fall
 * under the root. Each line has pricing and translated texts.
 *
 * Sublines (if any) are returned in `line.sublines`.
 */
export type SublinesResponse = {
  line?: Line;
  debug?: Debug;
  /**
   * The language in which `Product.name` and `PriceLine.name` are
   * translated into.
   *
   *
   * If requested language was not found, resolved language is empty.
   * Names are replaced with IDs.
   */
  language?: string;
  /**
   * The `packagePath` from the request, or the latest versioned path of
   * the package if no version was specified. Subsequent API requests
   * during the same configuration session should use the versioned
   * package path.
   */
  packagePath?: string;
};
/**
 * Provides trace information.
 */
export type Trace = {
  identifier?: string;
  message?: string;
  details?: string;
  severity?: string;
  children?: Trace[];
};
/**
 * Represents the state of a `ConfigurationValue`, as determined by the
 * configure service.
 *
 * ValueState describes the **assignment state** of a `ConfigurationValue`
 * and the **cause** (if any) for why the value is in that state.
 *
 * | Assignment state | Description |
 * |------------------|-------------|
 * | `assigned` is `null` | The value is unassigned. |
 * | `assigned` is `byUser` | The value is assigned by user. |
 * | `assigned` is `byDefault` | The value is assigned by system as a default value. |
 * | `assigned` is `byPhase` | The value is assigned by system because of previous phases. |
 * | `assigned` is `byRule` | The value is assigned by system because of rule. |
 * | `incompatible` is `true`| Assigning the value will cause other assignments to be removed. |
 *
 * Use `ValueState` to create UI that emphasizes a `ConfigurationValue`'s state.
 *
 * For example:
 *
 * - If a value is incompatible (`incompatible` is `true`), you could give
 *   it a background color, making the user aware that there is something
 *   different about the value.
 * - If a user has made an assignment (`assigned` has set to `byUser`), you
 *   could add a user icon next to the value so that the user can easily
 *   identify assignments they've made.
 */
export type ValueState = {
  /**
   * Describes how the value was assigned. If this property is not
   * include in the response, the value is unassigned.
   *
   * | Value | Description |
   * |-------|-------------|
   * |`byUser`|The user assigned the value.|
   * |`byDefault`|The system assigned a default value.|
   * |`byPhase`|The system assigned a value due to a previous phase assignment.|
   * |`byRule`|The system assigned the value due to a rule.|
   */
  assigned?: 'byUser' | 'byDefault' | 'byPhase' | 'byRule';
  /**
   * Indicates whether the value is incompatible. Assigning incompatible
   * values causes other assignments to be removed.
   */
  incompatible?: boolean;
  /**
   * The configuration state of a variable's value. Describes whether the
   * value is assigned, can be assigned, and the consequences of
   * assigning it.
   *
   * `state` is set only if `Settings.includeStateAndJustification` is
   * `true`. Combined with `Justification` it details
   * `ValueState.assigned` and `ValueState.incompatible`.
   *
   * | Assignment state | Description |
   * |------------------|-------------|
   * | Available | The value can be freely assigned. |
   * | Unavailable | Depending on the `justification`, the value can either not be assigned at all, or would remove one of the other assigned values.|
   * | Selected | The value is assigned, either by the user, or because it is a default value.|
   * | Inferred | The value is assigned for one of these reasons: As a consequence of an assignment or a default applied to another variable; It is the only value available according to the rules; It is the only value defined in the variable's domain.|
   */
  state?: 'Available' | 'Unavailable' | 'Selected' | 'Inferred';
  /**
   * The justification of a value's state. Only set if
   * `includeStateAndJustification` is `true`.
   *
   * Provides context for how the configuration engine determined the
   * value's state. Combined with `State` it details
   * `ValueState.assigned` and `ValueState.incompatible`.
   *
   * | Justification | Description |
   * |------------------|-------------|
   * | None | A value with state Available has no justification. |
   * | Rule | The state is exclusively due to rules, and not because of other assignments. |
   * | Assignment | If state is Selected, it is because the value was assigned in the request. If state is Unavailable or Inferred, it is due to an assignment to other variable(s) in combination with the rules. |
   * | Default | If state is Selected, it is because it is a default value. If state is Unavailable or Inferred, it is because another default value was assigned. |
   * | Phase | The value state is due to assignments, defaults, and/or rules from a previous phase. Note: Only applies to state Unavailable or Inferred, only when the phases are defined in the model or request. |
   */
  justification?: 'None' | 'Rule' | 'Assignment' | 'Default' | 'Phase';
};
/**
 * A value and its currency.
 */
export type ValueWithCurrency = {
  /**
   * The value.
   */
  value?: number;
  /**
   * The currency. For example, "EU" for euros, or "USD" for US dollars.
   */
  currency?: string;
};
/**
 * A value and its unit of measurement. When representing batch sizes,
 * `value` is the size, and `unit` is the batch.
 */
export type ValueWithUnit = {
  /**
   * The value.
   */
  value?: number;
  /**
   * The unit of measurement.
   */
  unit?: string;
};
/**
 * Represents a value assignment to a variable.
 */
export type VariableAssignment = {
  /**
   * The ID of the variable to assign to.
   */
  variableId?: string;
  /**
   * The value to assign to the variable.
   */
  value?: string | number | boolean;
  /**
   * > Unsupported by SAP products.
   *
   * The priority of the assignment. Only used if
   * `settings.assignmentResolutionOrder` is `ByPriority`.
   *
   * When the configure service removes assignments, it removes them in
   * order of lowest priority to highest priority.
   *
   * You can use priority to ensure that the user's most recent
   * assignment will be the last one removed by setting its priority to a
   * high value and lowering the value of other assignments.
   */
  priority?: number;
  /**
   * > For multi-value variables only.
   *
   * Indicates whether the value is excluded.
   */
  exclude?: boolean;
};

export function isIntervalValue(t: ConfigurationValue): t is IntervalValue {
  return t.type === 'IntervalValue';
}
export function isSingletonValue(t: ConfigurationValue): t is SingletonValue {
  return t.type === 'SingletonValue';
}