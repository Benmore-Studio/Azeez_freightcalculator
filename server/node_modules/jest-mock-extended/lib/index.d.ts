export { JestMockExtended, GlobalConfig, mockDeep, MockProxy, DeepMockProxy, CalledWithMock, mockClear, mockReset, mockFn, stub, } from './Mock';
export declare const mock: <T, MockedReturn extends import("./Mock").MockProxy<T> & T = import("./Mock")._MockProxy<T> & T>(mockImplementation?: import("ts-essentials").DeepPartial<T>, opts?: import("./Mock").MockOpts) => MockedReturn;
export declare const calledWithFn: <T extends import("jest-mock").FunctionLike>({ fallbackMockImplementation, }?: {
    fallbackMockImplementation?: T;
}) => import("./Mock").CalledWithMock<T>;
export * from './Matchers';
