import { AxiosResponse } from 'axios';
import { ApiResponse } from '../src/common/ApiResponse';

test('ApiResponse has the correct pageCount value', () => {
    const baseUrl = 'https://test.com/path';
    const expectedPage = 7;

    const axiosResponse = {
        data: null,
        status: 200,
        headers: {
            link: `<${baseUrl}?page=1>; rel="first", <${baseUrl}?page=${expectedPage}>; rel="last"`,
        },
    } as AxiosResponse<null>;

    const response = new ApiResponse<null>(axiosResponse);

    expect(response.pageCount).toBe(expectedPage);
});

test('ApiResponse do not fail if no have Link header', () => {
    const axiosResponse = {
        data: null,
        status: 200,
        headers: {},
    } as AxiosResponse<null>;

    const response = new ApiResponse<null>(axiosResponse);

    expect(response.pageCount).toBe(undefined);
});

test('If no have last link, expect undefined pageCount', () => {
    const axiosResponse = {
        data: null,
        status: 200,
        headers: {
            link: `<https://test.com/path?page=1>; rel="first"`,
        },
    } as AxiosResponse<null>;

    const response = new ApiResponse<null>(axiosResponse);

    expect(response.pageCount).toBe(undefined);
});
