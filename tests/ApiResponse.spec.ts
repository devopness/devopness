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
