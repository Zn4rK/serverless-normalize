import { OutgoingHttpHeaders } from "http";

type SingleValue = { [header: string]: string | number };
type MultiValue = { [header: string]: string[] };

type FilteredHeaders = [SingleValue, MultiValue];

export const filterHeaders = (input: OutgoingHttpHeaders): FilteredHeaders => {
  const singleValue = {};
  const multiValue = {};

  Object.keys(input).forEach((key) => {
    const value = input[key];

    if (Array.isArray(value)) {
      multiValue[key] = value;
      return;
    }

    singleValue[key] = value;
  });

  return [singleValue, multiValue];
};
