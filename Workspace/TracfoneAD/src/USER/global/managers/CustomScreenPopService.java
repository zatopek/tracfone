package USER.global.managers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jacada.jad.screenpop.dto.ScreenPopDataDto;
import com.jacada.jad.screenpop.dto.ScreenPopUpdatedDataDto;
import com.jacada.jad.screenpop.service.DefaultScreenPopService;
import com.jacada.jad.screenpop.service.url.ScreenPopURLService;

@Service
public class CustomScreenPopService extends DefaultScreenPopService{
	
	@Autowired
	public CustomScreenPopService(ScreenPopURLService urlService) {
		super(urlService);
	}

	@Override
	public ScreenPopUpdatedDataDto replaceURLRequestParametersValue(ScreenPopDataDto screenPopInfo) {
        /*String url = screenPopInfo.getUrl();
        Map<String, String> values = getURLReqeustParametersReplacementValues(screenPopInfo);
        for(Entry<String, String> e: values.entrySet()){
               if(StringUtils.hasText(e.getKey())){
                     url = url.replace(e.getKey(), e.getValue());
               }
        }
        return new ScreenPopUpdatedDataDto(url, true);*/

		return super.replaceURLRequestParametersValue(screenPopInfo);
	}
	
	@Override
	public Map<String, String> getURLRequestParametersReplacementValues(ScreenPopDataDto screenPopInfo) {
		/*Map<String, String> values = super.getURLReqeustParametersReplacementValues(screenPopInfo);
		values.put("myParam", "myValue");
		values.put(ScreenPopSupportedParameters.CALLER_NAME.value(), "Joe");
		return values;*/
		return super.getURLRequestParametersReplacementValues(screenPopInfo);
	}
	
}
